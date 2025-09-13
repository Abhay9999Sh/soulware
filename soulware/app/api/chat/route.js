import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return Response.json({ success: false, error: "Booking ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const { ObjectId } = require("mongodb");

    // Get booking details
    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(bookingId),
      status: "accepted",
      mode: "chat",
    });

    if (!booking) {
      return Response.json({ success: false, error: "Valid chat booking not found" }, { status: 404 });
    }

    // Ensure user is participant
    if (booking.studentId !== clerkUserId && booking.counselorId !== clerkUserId) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Check if chat already exists
    let existingChat = await db.collection("chats").findOne({ bookingId });

    if (existingChat) {
      await db.collection("chats").updateOne(
        { bookingId },
        { $set: { isActive: true, updatedAt: new Date() } }
      );
      return Response.json({
        success: true,
        chatId: existingChat._id.toString(),
        chat: existingChat,
      });
    }

    // Create new chat
    const chatData = {
      bookingId,
      participants: {
        student: booking.studentId,
        counselor: booking.counselorId,
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("chats").insertOne(chatData);

    await db.collection("bookings").updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { chatId: result.insertedId.toString() } }
    );

    return Response.json({
      success: true,
      chatId: result.insertedId.toString(),
      chat: { ...chatData, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Chat creation error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { userId: clerkUserId } = await auth();
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return Response.json({ success: false, error: "Chat ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const { ObjectId } = require("mongodb");

    const chat = await db.collection("chats").findOne({ _id: new ObjectId(chatId) });

    if (!chat) {
      return Response.json({ success: false, error: "Chat not found" }, { status: 404 });
    }

    if (chat.participants.student !== clerkUserId && chat.participants.counselor !== clerkUserId) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    return Response.json({ success: true, chat });
  } catch (error) {
    console.error("Get chat error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await req.json();
    const { chatId, isActive } = body;

    const client = await clientPromise;
    const db = client.db();
    const { ObjectId } = require("mongodb");

    const chat = await db.collection("chats").findOne({ _id: new ObjectId(chatId) });
    if (!chat) {
      return Response.json({ success: false, error: "Chat not found" }, { status: 404 });
    }

    if (chat.participants.student !== clerkUserId && chat.participants.counselor !== clerkUserId) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const result = await db.collection("chats").updateOne(
      { _id: new ObjectId(chatId) },
      { $set: { isActive, updatedAt: new Date() } }
    );

    return Response.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error("Update chat error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
