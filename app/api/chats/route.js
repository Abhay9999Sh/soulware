import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Conversation, Message } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(req) {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    try {
        const counselor = await User.findOne({ clerkId });
        if (!counselor || counselor.role !== 'counselor') {
            return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
        }

        // Find all conversations the counselor is a part of
        const conversations = await Conversation.find({ participants: counselor._id })
            .populate({
                path: 'participants',
                select: 'profile.displayName', // Get the names of all participants
                match: { _id: { $ne: counselor._id } } // Exclude the counselor to easily find the student
            })
            .lean(); // Use .lean() for better performance

        // Find the last message for each conversation
        const chatSummaries = await Promise.all(conversations.map(async (convo) => {
            const lastMessage = await Message.findOne({ conversationId: convo._id })
                .sort({ createdAt: -1 })
                .lean();
            
            return {
                conversationId: convo._id,
                studentName: convo.participants[0]?.profile?.displayName || 'Student',
                lastMessage: lastMessage?.text || 'No messages yet.',
                lastMessageAt: lastMessage?.createdAt || convo.updatedAt,
            };
        }));

        // Sort by the most recent message
        chatSummaries.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

        return NextResponse.json(chatSummaries);

    } catch (error) {
        console.error("Failed to fetch chat summaries:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}