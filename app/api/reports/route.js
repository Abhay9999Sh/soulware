import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { PeerReport, User } from "@/lib/models";

// --- ADD THIS FUNCTION ---
// GET all reports for the volunteer queue
export async function GET() {
  await dbConnect();
  try {
    const reports = await PeerReport.find({}).sort({ createdAt: "desc" }).lean();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

// --- Your existing POST function stays the same ---
export async function POST(req) {
  await dbConnect();

  const { reporterId: reporterClerkId, targetType, targetId, reason } = await req.json();

  const reporter = await User.findOne({ clerkId: reporterClerkId });
  if (!reporter) {
    return NextResponse.json({ error: "Reporter user not found" }, { status: 404 });
  }

  const report = new PeerReport({
    reporterId: reporter._id,
    targetType,
    targetId,
    reason,
  });

  await report.save();
  return NextResponse.json(report, { status: 201 });
}