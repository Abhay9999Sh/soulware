import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, Appointment } from '@/lib/models';

// PUT - Update booking status (for counselors to mark as completed)
export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { id } = params;
    const { status } = await request.json();

    // Validate status
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get counselor from database
    const counselor = await User.findOne({ clerkId: userId });
    if (!counselor || counselor.role !== 'counselor') {
      return NextResponse.json({ error: 'Only counselors can update booking status' }, { status: 403 });
    }

    // Find and update the appointment
    const appointment = await Appointment.findOneAndUpdate(
      { 
        _id: id,
        counselorId: counselor._id
      },
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('studentId', 'profile.displayName')
     .populate('counselorId', 'profile.displayName');

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Appointment status updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Error updating appointment status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get specific booking details
export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { id } = params;

    // Get user from database
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the appointment
    let query = { _id: id };
    
    // Restrict access based on role
    if (user.role === 'student') {
      query.studentId = user._id;
    } else if (user.role === 'counselor') {
      query.counselorId = user._id;
    } else if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const appointment = await Appointment.findOne(query)
      .populate('studentId', 'profile.displayName')
      .populate('counselorId', 'profile.displayName');

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(appointment);

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
