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

// POST: Find existing conversation or create a new one (single chat per student-counselor pair)
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

        // Check if there's already an active conversation between this student and counselor
        let conversation = await Conversation.findOne({
            participants: { $all: [studentId, counselorId] },
            isActive: true
        }).populate('participants', 'clerkId profile');

        // If no existing conversation, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [studentId, counselorId],
                title: `Chat with ${counselor.profile?.displayName || 'Counselor'}`,
                isActive: true
            });
            
            await conversation.save();
            
            // Populate the participants for consistent response
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'clerkId profile');

            return NextResponse.json({ 
                conversationId: conversation._id,
                message: "New chat session created successfully",
                isNewConversation: true
            });
        } else {
            // Return existing conversation
            return NextResponse.json({ 
                conversationId: conversation._id,
                message: "Continuing existing chat session",
                isNewConversation: false
            });
        }

    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}