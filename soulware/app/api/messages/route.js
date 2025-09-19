import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Message, Conversation } from '@/lib/models';

// GET all messages for a specific conversation
export async function GET(req) {
    const { userId: clerkId } = auth();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    // ... (verify user is a participant of the conversation) ...

    const messages = await Message.find({ conversationId })
        .sort({ createdAt: 1 })
        .populate({ path: 'senderId', select: 'clerkId profile' });

    return NextResponse.json(messages);
}

// POST a new message to a conversation
export async function POST(req) {
    const { userId: clerkId } = await auth();
    await dbConnect();
    const { conversationId, text } = await req.json();

    const user = await User.findOne({ clerkId });

    // ... (verify user is a participant of the conversation) ...

    const message = new Message({
        conversationId,
        text,
        senderId: user._id,
    });
    await message.save();

    // Here you would also emit the message via Socket.IO
    
    return NextResponse.json({ success: true, message }, { status: 201 });
}