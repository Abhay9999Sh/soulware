import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Conversation } from '@/lib/models';

export async function GET(req, { params }) {
    const { userId: clerkId } = await auth();
    const { conversationId } = await params; // Await params in Next.js 15

    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    try {
        const user = await User.findOne({ clerkId }).lean();
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const conversation = await Conversation.findById(conversationId)
            .populate({
                path: 'participants',
                select: 'clerkId profile.displayName'
            });

        if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

        // Security Check: Ensure the current user is part of this conversation
        const isParticipant = conversation.participants.some(p => p._id.toString() === user._id.toString());
        if (!isParticipant) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error("Failed to fetch conversation:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}