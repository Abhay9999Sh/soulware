import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { PeerPost, User } from "@/lib/models";
import mongoose from "mongoose";

// PATCH a post to nominate it for Community Highlight
export async function PATCH(request, { params }) {
  await dbConnect();
  try {
    const { postId } = await params; // Await params in Next.js 15

    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Security Check: Ensure the user is a volunteer or admin
    const user = await User.findOne({ clerkId });
    if (!user || !["volunteer", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 });
    }

    // Ensure fields exist on old docs
    await PeerPost.updateMany(
      { isNominated: { $exists: false } },
      { $set: { isNominated: false, isWeeklyHighlight: false } }
    );

    // Nominate the post
    const updatedPost = await PeerPost.findByIdAndUpdate(
      postId,
      { $set: { isNominated: true } },
      { new: true }
    ).lean();

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log("Updated post:", updatedPost); // 👈 debug log

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Failed to nominate post:", error);
    return NextResponse.json({ error: "Failed to nominate post" }, { status: 500 });
  }
}
