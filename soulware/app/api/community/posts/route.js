import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { PeerPost, User } from "@/lib/models";
import { auth } from "@clerk/nextjs/server";

// GET all posts for the community feed
export async function GET() {
  await dbConnect();
  try {
    const { userId: clerkId } = auth();
    let currentUser = null;
    if (clerkId) {
      currentUser = await User.findOne({ clerkId }).lean();
    }
    
    const posts = await PeerPost.find().sort({ createdAt: -1 }).lean();

    // Attach user-specific data to each post
    const postsWithData = posts.map(post => {
      if (currentUser) {
        post.isUpvoted = post.upvotes.some(id => id.equals(currentUser._id));
      } else {
        post.isUpvoted = false;
      }
      return post;
    });

    return NextResponse.json(postsWithData);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST a new post to the community
export async function POST(req) {
  try {
    await dbConnect();

    const { userId: clerkId, title, body, tags } = await req.json();

    // Basic validation to ensure required fields are present
    if (!clerkId || !title || !body || !tags) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the user in your database using their Clerk ID.
    const user = await User.findOne({ clerkId: clerkId });
    if (!user) {
      console.error(`User with Clerk ID ${clerkId} not found in the database.`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the new post using the user's MongoDB _id.
    const post = new PeerPost({
      userId: user._id, // Use the MongoDB ObjectId here
      title,
      body,
      tags,
    });

    await post.save();
    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    // This will catch any errors during the process, including JSON parsing or DB errors
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post", details: error.message }, { status: 500 });
  }
}
