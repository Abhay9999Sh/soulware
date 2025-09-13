import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, areas, trained, assignedSections } = body;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("volunteerProfiles").insertOne({
      userId,
      areas: areas ? areas.split(",").map(s => s.trim()) : [],
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
    const profile = await db.collection("volunteerProfiles").findOne({ userId });

    return Response.json(profile || {});
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
