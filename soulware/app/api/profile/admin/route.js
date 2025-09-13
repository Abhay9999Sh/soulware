import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const body = await req.json();
  const { userId, name, email, designation, permissions } = body;
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("admins").insertOne({
      userId,
      name,
      email,
      designation,
      permissions: permissions ? permissions.split(",").map(p => p.trim()) : [],
      createdAt: new Date(),
    });
    return Response.json({ success: true, id: result.insertedId });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  
  try {
    const client = await clientPromise;
    const db = client.db();
    const admin = await db.collection("admins").findOne({ userId });
    return Response.json(admin || {});
  } catch (error) {
    console.error("Admin Profile GET Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
