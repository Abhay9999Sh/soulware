import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Conversation } from '@/lib/models';

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

        // Find a conversation that includes both the student and the counselor
        let conversation = await Conversation.findOne({
            participants: { $all: [studentId, counselorId] }
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [studentId, counselorId]
            });
            await conversation.save();
        }

        return NextResponse.json({ conversationId: conversation._id });

    } catch (error) {
        console.error("Error starting or finding conversation:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}