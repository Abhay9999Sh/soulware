import { connectToDatabase } from "@/lib/db/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      userId, 
      name, 
      email, 
      specialization, 
      qualification, 
      languages, 
      bio,
      // Legacy fields
      department,
      availableSlots 
    } = body;

    const { db } = await connectToDatabase();

    // Check if counselor already exists
    const existingCounselor = await db.collection("counselors").findOne({ userId });
    if (existingCounselor) {
      return Response.json({ success: false, error: "Counselor profile already exists" }, { status: 400 });
    }

    const counselorData = {
      userId,
      name,
      email,
      specialization,
      qualification: qualification || "PhD in Clinical Psychology",
      languages: languages || ["English"],
      bio,
      isVerified: false, // Admin needs to verify
      availableSlots: [],
      availableDays: [],
      timeSlots: [],
      unavailableDates: [],
      isAvailable: true,
      status: "offline",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("counselors").insertOne(counselorData);

    return Response.json({ success: true, id: result.insertedId, counselor: counselorData });
  } catch (error) {
    console.error("Counselor profile creation error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    const { db } = await connectToDatabase();
    
    if (userId) {
      // Get specific counselor by userId
      let profile = await db.collection("counselors").findOne({ userId });
      
      // Fallback to counselorProfiles collection if not found
      if (!profile) {
        profile = await db.collection("counselorProfiles").findOne({ userId });
        
        // If found in old collection, treat as verified (backward compatibility)
        if (profile) {
          profile.isVerified = true;
          profile.status = profile.status || "online";
        }
      }
      
      // Ensure backward compatibility - existing counselors without isVerified should be verified
      if (profile && profile.isVerified === undefined) {
        profile.isVerified = true;
        profile.status = profile.status || "online";
      }
      
      return Response.json(profile || {});
    } else {
      // Get all counselors
      let counselors = await db.collection("counselors").find({}).toArray();
      
      // Fallback to counselorProfiles if counselors collection is empty
      if (counselors.length === 0) {
        counselors = await db.collection("counselorProfiles").find({}).toArray();
        
        // Mark old profiles as verified for backward compatibility
        counselors = counselors.map(counselor => ({
          ...counselor,
          isVerified: true,
          status: counselor.status || "online"
        }));
      }
      
      // Ensure all counselors have verification status
      counselors = counselors.map(counselor => ({
        ...counselor,
        isVerified: counselor.isVerified !== undefined ? counselor.isVerified : true,
        status: counselor.status || "online"
      }));
      
      return Response.json(counselors);
    }
  } catch (error) {
    console.error("Get counselor error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId, action, ...updateData } = body;

    if (!userId) {
      return Response.json({ success: false, error: "userId is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    let updateFields = { updatedAt: new Date() };

    if (action === "verify") {
      updateFields.isVerified = true;
      updateFields.status = "online";
    } else if (action === "unverify") {
      updateFields.isVerified = false;
      updateFields.status = "offline";
    } else {
      // Regular update
      updateFields = { ...updateData, updatedAt: new Date() };
    }

    const result = await db.collection("counselors").updateOne(
      { userId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return Response.json({ success: false, error: "Counselor not found" }, { status: 404 });
    }

    return Response.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error("Update counselor error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
