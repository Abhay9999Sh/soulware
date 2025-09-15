import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Add the specific counselor you mentioned
    const counselorData = {
      userId: "user_32bl51bUU3I67QF6Y9V9nO1JwIT",
      name: "Abhi",
      email: "abhay999939@gmail.com",  
      department: "CSE",
      specialization: "Counselling",
      availableSlots: [new Date()],
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      timeSlots: [
        "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00",
        "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
        "18:00-19:00", "19:00-20:00", "20:00-21:00"
      ],
      unavailableDates: [],
      isAvailable: true,
      status: "online",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if counselor already exists
    const existingCounselor = await db.collection("counselors").findOne({
      userId: counselorData.userId
    });

    if (existingCounselor) {
      // Update existing counselor
      await db.collection("counselors").updateOne(
        { userId: counselorData.userId },
        { 
          $set: {
            ...counselorData,
            updatedAt: new Date()
          }
        }
      );
      return Response.json({ success: true, message: "Counselor updated", counselor: counselorData });
    } else {
      // Insert new counselor
      const result = await db.collection("counselors").insertOne(counselorData);
      return Response.json({ success: true, message: "Counselor created", id: result.insertedId });
    }
  } catch (error) {
    console.error("Setup counselor error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const counselors = await db.collection("counselors").find({}).toArray();
    return Response.json({ success: true, counselors });
  } catch (error) {
    console.error("Get counselors error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
