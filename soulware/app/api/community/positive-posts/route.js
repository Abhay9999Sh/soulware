import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { PeerPost } from "@/lib/models";

// GET the most upvoted posts from the last 7 days for the volunteer curation feed
export async function GET() {
  await dbConnect();
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const positivePosts = await PeerPost.find({
      // Filter by creation date AND exclude already nominated posts
      createdAt: { $gte: oneWeekAgo },
      isNominated: { $ne: true } // Exclude posts that are already nominated
    })
    .sort({ 'upvotes.length': -1 }) // Correctly sort by the number of items in the upvotes array
    .limit(10)
    .lean();
      
    return NextResponse.json(positivePosts);
  } catch (error) {
    console.error("Failed to fetch positive posts:", error);
    return NextResponse.json({ error: "Failed to fetch positive posts" }, { status: 500 });
  }
}
