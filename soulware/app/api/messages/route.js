import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Message, Conversation } from '@/lib/models';

// GET all messages for a specific conversation
export async function GET(req) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('conversationId');
        
        if (!conversationId) {
            return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });
        }

        await dbConnect();
        
        const user = await User.findOne({ clerkId });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Verify user is a participant of the conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(user._id)) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 })
            .populate({ path: 'senderId', select: 'clerkId profile' });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST a new message to a conversation
export async function POST(req) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        await dbConnect();
        const { conversationId, text } = await req.json();

        if (!conversationId || !text?.trim()) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findOne({ clerkId });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Verify user is a participant of the conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(user._id)) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const message = new Message({
            conversationId,
            text: text.trim(),
            senderId: user._id,
        });
        await message.save();

        // Populate the sender info for the response
        await message.populate({ path: 'senderId', select: 'clerkId profile' });
        
        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error("Error creating message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}