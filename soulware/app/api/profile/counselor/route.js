import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, qualification, department, specialization, availableSlots } = body;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("counselorProfiles").insertOne({
      userId,
      qualification,
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
    const profile = await db.collection("counselorProfiles").findOne({ userId });

    return Response.json(profile || {});
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
