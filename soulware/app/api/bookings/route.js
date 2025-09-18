import { connectToDatabase } from "@/lib/db/mongodb";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { userId: clerkUserId } = await auth();
    console.log("Clerk userId from auth():", clerkUserId);

      const body = await req.json();
      console.log("Received booking body:", body);

      const { studentId, counselorId, mode, type, slot, isAnonymous, urgency, notes, roomNumber } = body;
      
      // Handle both 'mode' and 'type' field names for session type
      const sessionType = mode || type || "chat";
    
    const { db } = await connectToDatabase();

    // Generate room number for in-person meetings if not provided
    const finalRoomNumber = roomNumber || (sessionType === "in-person" ? `Room ${Math.floor(Math.random() * 20) + 1}` : null);

      // Base booking data
      const bookingData = {
        studentId: studentId || clerkUserId,
        counselorId,
        mode: sessionType, // Always use 'mode' as the consistent field name
        type: sessionType, // Also save as 'type' for backward compatibility
        slot: new Date(slot),
        isAnonymous: isAnonymous || false,
        status: "pending", // All requests start as pending
        chatId: null, // only populated if sessionType === "chat"
        roomNumber: finalRoomNumber, // for in-person meetings
        urgency: urgency || "normal",
        notes: notes || "", // Add notes field
        createdAt: new Date(),
        updatedAt: new Date(),
      };    // Insert booking first
    const result = await db.collection("bookings").insertOne(bookingData);
    console.log("MongoDB booking insert:", result.insertedId);

    let chatId = null;

    // If booking is for chat mode, create a chat room
    if (sessionType === "chat") {
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
    const bookingId = searchParams.get("bookingId");
    const status = searchParams.get("status");

    const { db } = await connectToDatabase();

    // If bookingId is provided, return single booking
    if (bookingId) {
      const booking = await db.collection("bookings").findOne({
        _id: new ObjectId(bookingId)
      });
      
      if (booking && booking.counselorId) {
        // Populate counselor information
        const counselor = await db.collection("counselors").findOne({
          userId: booking.counselorId
        });
        if (counselor) {
          booking.counselorDetails = {
            name: counselor.name,
            firstName: counselor.firstName || counselor.name?.split(' ')[0],
            lastName: counselor.lastName || counselor.name?.split(' ')[1] || '',
            specialty: counselor.specialty,
            avatar: counselor.avatar || '👨‍⚕️'
          };
        }
      }
      
      return Response.json(booking || {});
    }

    // Otherwise, return filtered list
    let query = {};
    if (studentId) query.studentId = studentId;
    if (counselorId) query.counselorId = counselorId;
    if (status) query.status = status;

    const bookings = await db
      .collection("bookings")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Populate counselor information for each booking
    for (let booking of bookings) {
      if (booking.counselorId) {
        const counselor = await db.collection("counselors").findOne({
          userId: booking.counselorId
        });
        if (counselor) {
          booking.counselorDetails = {
            name: counselor.name,
            firstName: counselor.firstName || counselor.name?.split(' ')[0],
            lastName: counselor.lastName || counselor.name?.split(' ')[1] || '',
            specialty: counselor.specialty,
            avatar: counselor.avatar || '👨‍⚕️'
          };
        }
      }
    }

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

    const { db } = await connectToDatabase();

    // Get the booking first to check if it's a chat booking
    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(bookingId)
    });

    if (!booking) {
      return Response.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    // Update booking status
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

    // If this is a chat booking being accepted, create chat room
    const sessionType = booking.mode || booking.type || "chat";
    if (status === "accepted" && sessionType === "chat" && !booking.chatId) {
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

      const chatResult = await db.collection("chats").insertOne(chatData);
      
      // Update booking with chatId
      await db.collection("bookings").updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { chatId: chatResult.insertedId.toString() } }
      );

      console.log("Chat room created for accepted booking:", chatResult.insertedId);
    }

    return Response.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error("Update booking error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
