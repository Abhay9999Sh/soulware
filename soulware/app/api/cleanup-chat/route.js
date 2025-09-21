import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { Conversation, Message } from '@/lib/models';

// POST: Clear all conversations and messages (for development/testing)
export async function POST() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();

        // Count existing data before deletion
        const conversationCount = await Conversation.countDocuments();
        const messageCount = await Message.countDocuments();

        console.log(`Found ${conversationCount} conversations and ${messageCount} messages to delete`);

        // Delete all messages first (to avoid foreign key issues)
        const deletedMessages = await Message.deleteMany({});
        console.log(`Deleted ${deletedMessages.deletedCount} messages`);

        // Delete all conversations
        const deletedConversations = await Conversation.deleteMany({});
        console.log(`Deleted ${deletedConversations.deletedCount} conversations`);

        return NextResponse.json({ 
            success: true,
            message: "Chat database cleared successfully",
            deleted: {
                conversations: deletedConversations.deletedCount,
                messages: deletedMessages.deletedCount
            }
        });

    } catch (error) {
        console.error("Error clearing chat database:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET: Get current chat database stats
export async function GET() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();

        const conversationCount = await Conversation.countDocuments();
        const messageCount = await Message.countDocuments();

        return NextResponse.json({
            conversations: conversationCount,
            messages: messageCount
        });

    } catch (error) {
        console.error("Error getting chat stats:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
