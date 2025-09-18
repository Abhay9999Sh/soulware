import { connectToDatabase } from "@/lib/db/mongodb";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await req.json();

    const { 
      role, 
      clerkId, 
      email, 
      isOnboarded, 
      profile,
      // Legacy fields
      name, 
      enrollmentNo, 
      year, 
      branch, 
      languagePref 
    } = body;

    if (!role) {
      return Response.json({ success: false, error: "Role is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const finalUser = {
      clerkId: clerkId || clerkUserId,
      email: email || body.email,
      role,
      isOnboarded: isOnboarded || false,
      profile: profile || {
        name: name,
        displayName: name,
      },
      metadata: {
        enrollmentNo,
        year,
        branch,
        languagePref,
      },
      status: "active",
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ clerkId: finalUser.clerkId });
    if (existingUser) {
      return Response.json({ success: false, error: "User already exists" }, { status: 400 });
    }

    const result = await db.collection("users").insertOne(finalUser);

    return Response.json({ success: true, id: result.insertedId, user: finalUser });
  } catch (error) {
    console.error("User creation error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clerkId = searchParams.get("clerkId");

  try {
    const { db } = await connectToDatabase();
    
    if (clerkId) {
      const user = await db.collection("users").findOne({ clerkId });
      return Response.json(user || {});
    }

    // If no clerkId, return all users (for admin dashboard)
    const users = await db.collection("users").find({}).toArray();
    return Response.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
