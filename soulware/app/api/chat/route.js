import { connectToDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET - Fetch a chat by ID or booking ID
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const bookingId = searchParams.get("bookingId");

    if (!chatId && !bookingId) {
      return NextResponse.json(
        { error: "Chat ID or Booking ID required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    let chat;
    if (chatId) {
      // Find by chat ID
      chat = await db.collection("chats").findOne({
        _id: new ObjectId(chatId),
        $or: [
          { "participants.student": userId },
          { "participants.counselor": userId },
        ],
      });
    } else {
      // Find by booking ID
      chat = await db.collection("chats").findOne({
        bookingId: new ObjectId(bookingId),
        $or: [
          { "participants.student": userId },
          { "participants.counselor": userId },
        ],
      });
    }

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error) {
    console.error("GET chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new chat or get existing one
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // First, verify the booking exists and user is a participant
    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(bookingId),
      $or: [
        { studentId: userId },
        { counselorId: userId },
      ],
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or access denied" },
        { status: 404 }
      );
    }

    // Check if booking is accepted (only accepted bookings can have chats)
    if (booking.status !== "accepted" && booking.status !== "active" && booking.status !== "completed") {
      return NextResponse.json(
        { error: "Chat is only available for accepted bookings" },
        { status: 400 }
      );
    }

    // Check if chat already exists for this booking
    let chat = await db.collection("chats").findOne({
      bookingId: new ObjectId(bookingId),
    });

    if (chat) {
      // Chat already exists, return it
      return NextResponse.json({ chat, created: false }, { status: 200 });
    }

    // Create new chat
    const newChat = {
      bookingId: new ObjectId(bookingId),
      participants: {
        student: booking.studentId,
        counselor: booking.counselorId,
      },
      chatType: booking.type, // "video" or "in-person"
      createdAt: new Date(),
      isActive: true,
      lastActivity: new Date(),
      lastMessage: null,
      messageCount: 0,
    };

    const result = await db.collection("chats").insertOne(newChat);

    // Return created chat with ID
    const createdChat = {
      _id: result.insertedId,
      ...newChat,
    };

    console.log("Chat created:", createdChat);

    return NextResponse.json({ chat: createdChat, created: true }, { status: 201 });
  } catch (error) {
    console.error("POST chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update chat (e.g., mark as inactive, update settings)
export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chatId, isActive, lastMessage } = body;

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Verify user is participant in this chat
    const chat = await db.collection("chats").findOne({
      _id: new ObjectId(chatId),
      $or: [
        { "participants.student": userId },
        { "participants.counselor": userId },
      ],
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found or access denied" },
        { status: 404 }
      );
    }

    // Build update object
    const updateFields = {
      lastActivity: new Date(),
    };

    if (typeof isActive === "boolean") {
      updateFields.isActive = isActive;
    }

    if (lastMessage) {
      updateFields.lastMessage = lastMessage;
    }

    // Update chat
    const result = await db.collection("chats").updateOne(
      { _id: new ObjectId(chatId) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update chat" },
        { status: 400 }
      );
    }

    // Get updated chat
    const updatedChat = await db
      .collection("chats")
      .findOne({ _id: new ObjectId(chatId) });

    return NextResponse.json({ chat: updatedChat }, { status: 200 });
  } catch (error) {
    console.error("PUT chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete/archive a chat
export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Verify user is participant in this chat
    const chat = await db.collection("chats").findOne({
      _id: new ObjectId(chatId),
      $or: [
        { "participants.student": userId },
        { "participants.counselor": userId },
      ],
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found or access denied" },
        { status: 404 }
      );
    }

    // Mark chat as archived instead of deleting
    const result = await db.collection("chats").updateOne(
      { _id: new ObjectId(chatId) },
      {
        $set: {
          isActive: false,
          archivedAt: new Date(),
          archivedBy: userId,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to archive chat" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}