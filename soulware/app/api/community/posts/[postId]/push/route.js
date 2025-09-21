import { NextResponse } from "next/server";
import { PeerPost } from "@/lib/models";
import dbConnect from "@/lib/mongoose"; // Import the new connector

export async function POST(req, { params }) {
  await dbConnect(); // Use the efficient connection
  const { postId } = await params; // Await params in Next.js 15
  const post = await PeerPost.findById(postId);
  post.pushedToAdmin = true;
  await post.save();
  return NextResponse.json(post);
}