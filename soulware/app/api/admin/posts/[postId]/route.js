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
        const { postId } = await params; // Await params in Next.js 15
        
        if (!await isAdmin(clerkId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const deletedPost = await PeerPost.findByIdAndDelete(postId);
        if (!deletedPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Cleanup: Also delete associated comments and reports to keep the DB clean
        await PeerComment.deleteMany({ postId });
        await PeerReport.deleteMany({ targetId: postId, targetType: 'post' });

        return NextResponse.json({ message: "Post and associated content deleted successfully" });
    } catch (error) {
        console.error('Failed to delete post:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}


// PATCH a post to highlight it or clear admin flags (Admin action)
export async function PATCH(req, { params }) {
    await dbConnect();
    try {
        const { userId: clerkId } = await auth();
        const { postId } = await params; // Await params in Next.js 15
        const body = await req.json();
        
        if (!await isAdmin(clerkId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        let updateFields = {};
        
        // Handle different types of updates
        if (body.isWeeklyHighlight !== undefined) {
            // Highlighting a post for weekly highlight
            updateFields = { 
                isWeeklyHighlight: body.isWeeklyHighlight,
                // When highlighting, we can also clear the nomination flag since it's been processed
                isNominated: false 
            };
        } else {
            // Default behavior: clear the admin flag
            updateFields = { pushedToAdmin: false };
        }

        const updatedPost = await PeerPost.findByIdAndUpdate(
            postId,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        
        console.log("✅ Post updated successfully:", updateFields);
        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Failed to update post:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
