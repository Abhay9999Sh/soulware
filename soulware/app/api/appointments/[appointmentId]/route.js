import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Appointment } from '@/lib/models';

export async function GET(req, { params }) {
    const { userId: clerkId } = await auth();
    const { appointmentId } = await params; // Await params in Next.js 15

    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    const user = await User.findOne({ clerkId }).lean();
    const appointment = await Appointment.findById(appointmentId)
        .populate({ path: 'studentId', select: 'clerkId profile.displayName' })
        .populate({ path: 'counselorId', select: 'clerkId profile.displayName' });

    if (!user || !appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Security check: ensure user is part of this appointment
    if (appointment.studentId._id.toString() !== user._id.toString() && appointment.counselorId._id.toString() !== user._id.toString()) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(appointment);
}