import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Conversation, Message } from '@/lib/models';

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();

        // Get database stats
        const conversationCount = await Conversation.countDocuments();
        const messageCount = await Message.countDocuments();
        const userCount = await User.countDocuments();

        // Get user info
        const user = await User.findOne({ clerkId });

        return NextResponse.json({ 
            message: "Chat API is working!",
            timestamp: new Date().toISOString(),
            stats: {
                conversations: conversationCount,
                messages: messageCount,
                users: userCount
            },
            currentUser: {
                id: user?._id,
                clerkId: user?.clerkId,
                role: user?.role,
                name: user?.profile?.displayName
            }
        });
    } catch (error) {
        console.error("Test chat API error:", error);
        return NextResponse.json({ 
            error: "Internal Server Error",
            details: error.message 
        }, { status: 500 });
    }
}
