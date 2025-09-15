import { connectToDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET - Fetch messages for a specific chat
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const since = searchParams.get("since"); // For polling new messages

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
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }

    // Build query for messages
    const messageQuery = { chatId: new ObjectId(chatId) };
    
    // If polling for new messages, only get messages after the 'since' timestamp
    if (since) {
      const sinceDate = new Date(parseInt(since));
      messageQuery.timestamp = { $gt: sinceDate };
    }

    // Fetch messages for this chat, sorted by timestamp
    const messages = await db
      .collection("messages")
      .find(messageQuery)
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chatId, content } = body;

    if (!chatId || !content?.trim()) {
      return NextResponse.json(
        { error: "Chat ID and message content required" },
        { status: 400 }
      );
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
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }

    // Check if chat is still active
    if (!chat.isActive) {
      return NextResponse.json({ error: "Chat session has ended" }, { status: 400 });
    }

    // Create new message
    const message = {
      chatId: new ObjectId(chatId),
      senderId: userId,
      content: content.trim(),
      timestamp: new Date(),
      messageType: "text",
    };

    const result = await db.collection("messages").insertOne(message);

    // Update chat's lastMessage and lastActivity
    await db.collection("chats").updateOne(
      { _id: new ObjectId(chatId) },
      {
        $set: {
          lastMessage: content.trim(),
          lastActivity: new Date(),
        },
      }
    );

    // Return the created message with the ID
    const createdMessage = {
      _id: result.insertedId,
      ...message,
    };

    console.log("Message created:", createdMessage);

    return NextResponse.json({ message: createdMessage }, { status: 201 });
  } catch (error) {
    console.error("POST messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a message (for editing)
export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageId, content } = body;

    if (!messageId || !content?.trim()) {
      return NextResponse.json(
        { error: "Message ID and content required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Verify message exists and user is the sender
    const message = await db.collection("messages").findOne({
      _id: new ObjectId(messageId),
      senderId: userId,
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found or access denied" },
        { status: 404 }
      );
    }

    // Update message
    const result = await db.collection("messages").updateOne(
      { _id: new ObjectId(messageId) },
      {
        $set: {
          content: content.trim(),
          editedAt: new Date(),
          isEdited: true,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update message" },
        { status: 400 }
      );
    }

    // Get updated message
    const updatedMessage = await db
      .collection("messages")
      .findOne({ _id: new ObjectId(messageId) });

    return NextResponse.json({ message: updatedMessage }, { status: 200 });
  } catch (error) {
    console.error("PUT messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a message
export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Verify message exists and user is the sender
    const message = await db.collection("messages").findOne({
      _id: new ObjectId(messageId),
      senderId: userId,
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found or access denied" },
        { status: 404 }
      );
    }

    // Mark message as deleted instead of actually deleting
    const result = await db.collection("messages").updateOne(
      { _id: new ObjectId(messageId) },
      {
        $set: {
          content: "This message was deleted",
          isDeleted: true,
          deletedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete message" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}