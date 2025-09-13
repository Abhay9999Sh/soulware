import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await req.json();

    const { role, name, email, enrollmentNo, year, branch, languagePref } = body;

    if (!role) {
      return Response.json({ success: false, error: "Role is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const finalUser = {
      clerkId: clerkUserId || body.userId,
      name,
      email,
      role,
      enrollmentNo,
      year,
      branch,
      languagePref,
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(finalUser);

    return Response.json({ success: true, id: result.insertedId });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clerkId = searchParams.get("clerkId");

  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ clerkId });

    return Response.json(user || {});
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
