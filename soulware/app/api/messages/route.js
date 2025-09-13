import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { getIO } from "@/pages/api/socket"; // ⚡ import socket instance

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

    const messages = await db
      .collection("messages")
      .find({ chatId })
      .sort({ timestamp: 1 })
      .toArray();

    await db.collection("messages").updateMany(
      { chatId, senderId: { $ne: clerkUserId }, isRead: false },
      { $set: { isRead: true } }
    );

    return Response.json({ success: true, messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await req.json();
    const { chatId, content } = body;

    if (!content || !chatId) {
      return Response.json({ success: false, error: "Content and chat ID are required" }, { status: 400 });
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

    const senderRole = chat.participants.student === clerkUserId ? "student" : "counselor";

    const messageData = {
      chatId,
      senderId: clerkUserId,
      senderRole,
      content: content.trim(),
      timestamp: new Date(),
      isRead: false,
    };

    const result = await db.collection("messages").insertOne(messageData);
    const message = { ...messageData, _id: result.insertedId };

    // ⚡ Broadcast new message from server
    try {
      const io = getIO();
      io.to(chatId.toString()).emit("message received", message);
    } catch (err) {
      console.warn("Socket not initialized, skipping emit");
    }

    return Response.json({ success: true, messageId: result.insertedId.toString(), message });
  } catch (error) {
    console.error("Send message error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
