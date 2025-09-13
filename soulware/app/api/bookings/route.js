import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { userId: clerkUserId } = await auth();
    console.log("Clerk userId from auth():", clerkUserId);

    const body = await req.json();
    console.log("Received booking body:", body);

    const { studentId, counselorId, mode, slot, isAnonymous } = body;

    const client = await clientPromise;
    const db = client.db();

    // Generate room number for in-person meetings
    const roomNumber = mode === "in-person" ? `Room ${Math.floor(Math.random() * 20) + 1}` : null;

    // Base booking data
    const bookingData = {
      studentId: studentId || clerkUserId,
      counselorId,
      mode,
      slot: new Date(slot),
      isAnonymous: isAnonymous || false,
      status: "pending",
      chatId: null, // only populated if mode === "chat"
      roomNumber, // for in-person meetings
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert booking first
    const result = await db.collection("bookings").insertOne(bookingData);
    console.log("MongoDB booking insert:", result.insertedId);

    let chatId = null;

    // If booking is for chat mode, create a chat room
    if (mode === "chat") {
      const chatDoc = {
        participants: [bookingData.studentId, bookingData.counselorId],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const chatResult = await db.collection("chats").insertOne(chatDoc);
      chatId = chatResult.insertedId;

      // Update booking with chatId
      await db.collection("bookings").updateOne(
        { _id: result.insertedId },
        { $set: { chatId } }
      );

      console.log("Created chat room and linked to booking:", chatId);
    }

    return Response.json({ success: true, id: result.insertedId, chatId });
  } catch (error) {
    console.error("Booking API Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const counselorId = searchParams.get("counselorId");
    const status = searchParams.get("status");

    const client = await clientPromise;
    const db = client.db();

    let query = {};
    if (studentId) query.studentId = studentId;
    if (counselorId) query.counselorId = counselorId;
    if (status) query.status = status;

    const bookings = await db
      .collection("bookings")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { bookingId, status, updatedBy } = body;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
          updatedBy,
        },
      }
    );

    return Response.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error("Update booking error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
