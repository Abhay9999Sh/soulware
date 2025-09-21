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

// POST: Finds an existing conversation or creates a new one
export async function POST(req) {
    const { userId: studentClerkId } = await auth();
    if (!studentClerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { counselorUserId } = await req.json(); // The MongoDB _id of the counselor
        await dbConnect();

        const student = await User.findOne({ clerkId: studentClerkId });
        if (!student) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const studentId = student._id;
        const counselorId = counselorUserId;

        // Sort participants to ensure consistent ordering for the unique index
        // This prevents [A,B] vs [B,A] duplicate key issues
        const sortedParticipants = [studentId, counselorId].sort((a, b) => 
            a.toString().localeCompare(b.toString())
        );

        // Use try-catch with findOne first, then create if needed
        let conversation = await Conversation.findOne({
            participants: { $all: sortedParticipants }
        });

        if (!conversation) {
            try {
                conversation = new Conversation({
                    participants: sortedParticipants
                });
                await conversation.save();
            } catch (duplicateError) {
                // If we get a duplicate key error, it means another request created it
                // So let's find the existing conversation
                if (duplicateError.code === 11000) {
                    conversation = await Conversation.findOne({
                        participants: { $all: sortedParticipants }
                    });
                    if (!conversation) {
                        throw new Error("Failed to create or find conversation");
                    }
                } else {
                    throw duplicateError;
                }
            }
        }

        return NextResponse.json({ conversationId: conversation._id });

    } catch (error) {
        console.error("Error starting or finding conversation:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}