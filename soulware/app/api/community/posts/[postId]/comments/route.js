import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { PeerComment, User } from "@/lib/models";

// GET all comments for a specific post
export async function GET(req, { params }) {
  await dbConnect();
  
  try {
    const { postId } = await params; // Next.js 15 fix - await params
    const comments = await PeerComment.find({ postId })
      .sort({ createdAt: "asc" })
      // Populate fetches the commenter's info from the User collection
      .populate("userId", "profile.nickname profile.avatarUrl") 
      .lean();
      
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST a new comment to a specific post
export async function POST(req, { params }) {
  await dbConnect();

  try {
    const { clerkId, body } = await req.json();
    const { postId } = await params; // Await params in Next.js 15

    // Find the user in your database by their Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the new comment
    const newComment = new PeerComment({
      body,
      postId,
      userId: user._id, // Use the user's MongoDB ObjectId
    });

    await newComment.save();
    
    // Populate the user info before sending it back
    const populatedComment = await PeerComment.findById(newComment._id)
      .populate("userId", "profile.nickname profile.avatarUrl")
      .lean();

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}