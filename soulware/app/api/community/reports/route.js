import { NextResponse } from "next/server";
// Import the User model
import { PeerReport, User } from "@/lib/models";
import dbConnect from "@/lib/mongoose";

export async function POST(req) {
  await dbConnect();

  // The 'reporterId' from the request is the Clerk ID
  const { reporterId: reporterClerkId, targetType, targetId, reason } = await req.json();

  // 1. Find the user who is reporting using their Clerk ID
  const reporter = await User.findOne({ clerkId: reporterClerkId });
  if (!reporter) {
    return NextResponse.json({ error: "Reporter user not found" }, { status: 404 });
  }

  // 2. Create the new report using the reporter's MongoDB `_id`
  const report = new PeerReport({
    reporterId: reporter._id, // Use the MongoDB ObjectId here
    targetType,
    targetId,
    reason,
  });

  await report.save();
  return NextResponse.json(report, { status: 201 });
}