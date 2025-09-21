import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { PeerPost, PeerComment, PeerReport } from "@/lib/models";
import mongoose from "mongoose"; // Ensure mongoose is imported directly

// GET a single post by its ID
export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { postId } = params;

    // This check prevents the route from processing invalid IDs like "positive"
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid post ID format" }, { status: 400 });
    }

    const post = await PeerPost.findById(postId).lean();
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: "Server error while fetching post" }, { status: 500 });
  }
}


// DELETE a post and all its associated comments and reports
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { postId } = await params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return NextResponse.json({ error: "Invalid post ID format" }, { status: 400 });
    }

    // Use a transaction to ensure all or nothing is deleted
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete the post itself
      await PeerPost.findByIdAndDelete(postId, { session });
      // Delete all comments associated with the post
      await PeerComment.deleteMany({ postId: postId }, { session });
      // Delete all reports targeting the post
      await PeerReport.deleteMany({ targetId: postId, targetType: 'post' }, { session });

      await session.commitTransaction();
      return NextResponse.json({ message: "Post and associated content deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      throw error; // Rethrow to be caught by the outer catch block
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}