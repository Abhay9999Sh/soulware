import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const body = await req.json();
  const { userId, name, email, role, trained, assignedSections } = body;
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("volunteers").insertOne({
      userId,
      name,
      email,
      role,
      trained: trained === "true" || trained === true,
      assignedSections: assignedSections ? assignedSections.split(",").map(s => s.trim()) : [],
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
    const volunteer = await db.collection("volunteers").findOne({ userId });
    return Response.json(volunteer || {});
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
