import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, PeerPost } from "@/lib/models";

// GET all posts that have been nominated for highlight
export async function GET() {
  await dbConnect();
  try {
    const { userId: clerkId } = await auth();
    const adminUser = await User.findOne({ clerkId });
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const nominatedPosts = await PeerPost.find({ isNominated: true, isWeeklyHighlight: { $ne: true } })
      .sort({ upvotes: -1 })
      .lean();
      
    // wrap in object
    return NextResponse.json({ posts: nominatedPosts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch nominated posts" }, { status: 500 });
  }
}
