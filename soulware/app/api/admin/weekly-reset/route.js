import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, PeerPost } from "@/lib/models";

// Helper function to verify if the user is an admin
async function isAdmin(clerkId) {
    if (!clerkId) return false;
    const adminUser = await User.findOne({ clerkId });
    return adminUser && adminUser.role === 'admin';
}

// POST endpoint to reset weekly highlights and nominations
export async function POST(req) {
    await dbConnect();
    try {
        const { userId: clerkId } = await auth();
        
        if (!await isAdmin(clerkId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Reset all weekly highlights and nominations for a fresh week
        const result = await PeerPost.updateMany(
            {}, // Update all posts
            { 
                $set: { 
                    isWeeklyHighlight: false,
                    isNominated: false 
                } 
            }
        );

        console.log(`✅ Weekly reset completed. Updated ${result.modifiedCount} posts.`);
        
        return NextResponse.json({ 
            message: "Weekly reset completed successfully",
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Failed to perform weekly reset:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
