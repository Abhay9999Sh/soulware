import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId: clerkUserId } = await auth();
    console.log("Clerk userId from auth():", clerkUserId);
    
    const body = await req.json();
    console.log("Received body:", body);
    
    const { userId, name, email, enrollmentNo, year, branch, languagePref, isAnonymous } = body;
    
    // Use Clerk userId if available, otherwise use the one from body
    const finalUserId = clerkUserId || userId;
    console.log("Final userId to store:", finalUserId);
    
    const client = await clientPromise;
    const db = client.db();
    
    const studentData = {
      userId: finalUserId,
      name,
      email,
      enrollmentNo,
      year: Number(year),
      branch,
      languagePref,
      isAnonymous,
      createdAt: new Date(),
    };
    
    console.log("Storing student data:", studentData);
    
    const result = await db.collection("students").insertOne(studentData);
    console.log("MongoDB insert result:", result);
    
    return Response.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  try {
    const client = await clientPromise;
    const db = client.db();
    const student = await db.collection("students").findOne({ userId });
    return Response.json(student || {});
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
