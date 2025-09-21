import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Conversation } from '@/lib/models';

// GET: Fetch all conversations for the current user
export async function GET() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();

        const user = await User.findOne({ clerkId });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const conversations = await Conversation.find({
            participants: user._id
        }).populate('participants', 'clerkId profile').sort({ updatedAt: -1 });

        // Format conversations for the frontend
        const formattedConversations = conversations.map(conv => {
            const otherParticipant = conv.participants.find(p => p._id.toString() !== user._id.toString());
            return {
                _id: conv._id,
                otherParticipant,
                lastMessage: "Start a conversation", // You can enhance this later
                updatedAt: conv.updatedAt
            };
        });

        return NextResponse.json(formattedConversations);

    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Creates a new conversation (allows multiple conversations between same participants)
export async function POST(req) {
    const { userId: studentClerkId } = await auth();
    if (!studentClerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { counselorUserId } = await req.json(); // The MongoDB _id of the counselor
        await dbConnect();

        const student = await User.findOne({ clerkId: studentClerkId });
        if (!student) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const counselor = await User.findById(counselorUserId);
        if (!counselor) return NextResponse.json({ error: "Counselor not found" }, { status: 404 });

        const studentId = student._id;
        const counselorId = counselorUserId;

        // Always create a new conversation to allow multiple chat sessions
        const conversation = new Conversation({
            participants: [studentId, counselorId],
            title: `Chat with ${counselor.profile?.displayName || 'Counselor'}`,
            isActive: true
        });
        
        await conversation.save();

        return NextResponse.json({ 
            conversationId: conversation._id,
            message: "New chat session created successfully"
        });

    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}