import { NextResponse } from "next/server";
import { PeerPost, User } from "@/lib/models";
import dbConnect from "@/lib/mongoose";

export async function POST(req, { params }) {
  await dbConnect();

  const { userId: clerkId } = await req.json();
  const { postId } = await params; // Fixed for Next.js 15 compatibility

  // Find the user document to get their MongoDB _id
  const user = await User.findOne({ clerkId });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const post = await PeerPost.findById(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const userMongoId = user._id;

  // Check if the user has already upvoted the post
  const voteIndex = post.upvotes.findIndex(id => id.equals(userMongoId));

  if (voteIndex > -1) {
    // If the user's ID is found, remove it (decrement)
    post.upvotes.splice(voteIndex, 1);
  } else {
    // If the user's ID is not found, add it (increment)
    post.upvotes.push(userMongoId);
  }

  await post.save();
  return NextResponse.json(post);
}