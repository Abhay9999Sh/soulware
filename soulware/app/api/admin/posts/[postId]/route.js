import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, PeerPost, PeerComment, PeerReport } from "@/lib/models";

// Helper function to verify if the user is an admin
async function isAdmin(clerkId) {
    if (!clerkId) return false;
    const adminUser = await User.findOne({ clerkId });
    return adminUser && adminUser.role === 'admin';
}

// DELETE a post entirely from the database (Admin action)
export async function DELETE(req, { params }) {
    await dbConnect();
    try {
        const { userId: clerkId } = await auth();
        if (!await isAdmin(clerkId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const deletedPost = await PeerPost.findByIdAndDelete(params.postId);
        if (!deletedPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Cleanup: Also delete associated comments and reports to keep the DB clean
        await PeerComment.deleteMany({ postId: params.postId });
        await PeerReport.deleteMany({ targetId: params.postId, targetType: 'post' });

        return NextResponse.json({ message: "Post and associated content deleted successfully" });
    } catch (error) {
        console.error('Failed to delete post:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}


// PATCH a post to clear the admin flag, keeping it in the community (Admin action)
export async function PATCH(req, { params }) {
    await dbConnect();
    try {
        const { userId: clerkId } = auth();
        if (!await isAdmin(clerkId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedPost = await PeerPost.findByIdAndUpdate(
            params.postId,
            { $set: { pushedToAdmin: false } }, // Set the flag to false
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        
        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Failed to update post:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
