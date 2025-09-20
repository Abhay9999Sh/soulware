// app/api/bookings/route.js

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Appointment } from '@/lib/models';

/**
 * @description POST: Create a new booking request (for students)
 */
export async function POST(req) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { counselorId, scheduledFor, mode, notes } = await req.json();

    const student = await User.findOne({ clerkId });
    if (!student) {
      return NextResponse.json({ error: 'Student user profile not found.' }, { status: 404 });
    }

    const newAppointment = new Appointment({
      studentId: student._id,
      counselorId,
      scheduledFor,
      mode,
      notes,
    });

    await newAppointment.save();
    
    return NextResponse.json({ success: true, id: newAppointment._id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * @description GET: Fetch all bookings for the logged-in counselor
 */
export async function GET(req) {
  const { userId: clerkId } =await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();
  
  try {
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let bookings;

    if (user.role === 'counselor') {
      // Counselor: Fetch all appointments where they are the counselor
      bookings = await Appointment.find({ counselorId: user._id })
        .populate({ path: 'studentId', select: 'profile.displayName' })
        .sort({ createdAt: -1 });
    } else {
      // Student: Fetch all of their own appointments
      bookings = await Appointment.find({ studentId: user._id })
        .populate({ path: 'counselorId', select: 'profile.displayName' })
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
/**
 * @description PUT: Update a booking's status (for counselors)
 */
export async function PUT(req) {
    const { userId: clerkId } =await auth();
    if (!clerkId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const { bookingId, status } = await req.json();
        const validStatuses = ["confirmed", "rejected", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
        }

        const counselor = await User.findOne({ clerkId });
        if (!counselor || counselor.role !== 'counselor') {
            return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
        }

        const booking = await Appointment.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        
        // **Security Check:** Ensure the counselor owns this booking before updating
        if (booking.counselorId.toString() !== counselor._id.toString()) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to update this booking." }, { status: 403 });
        }

        booking.status = status;
        await booking.save();
        
        return NextResponse.json({ success: true, updatedBooking: booking });
    } catch (error) {
        console.error("Failed to update booking:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}