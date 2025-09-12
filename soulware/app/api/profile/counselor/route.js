import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const body = await req.json();
  const { userId, name, email, department, specialization, availableSlots } = body;
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("counselors").insertOne({
      userId,
      name,
      email,
      department,
      specialization,
      availableSlots: availableSlots ? availableSlots.split(",").map(d => new Date(d.trim())) : [],
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
    const counselor = await db.collection("counselors").findOne({ userId });
    return Response.json(counselor || {});
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
