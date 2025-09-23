import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { Rating, User, Appointment } from '@/lib/models';

// POST - Submit a rating
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { appointmentId, counselorId, rating, feedback } = await request.json();

    // Validate input
    if (!appointmentId || !counselorId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Get student from database
    const student = await User.findOne({ clerkId: userId });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Verify the appointment exists and belongs to this student
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      studentId: student._id,
      counselorId: counselorId,
      status: 'completed'
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found or not completed' }, { status: 404 });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({ appointmentId });
    if (existingRating) {
      return NextResponse.json({ error: 'Rating already submitted for this appointment' }, { status: 400 });
    }

    // Create new rating
    const newRating = new Rating({
      studentId: student._id,
      counselorId,
      appointmentId,
      rating,
      feedback: feedback || ''
    });

    await newRating.save();

    return NextResponse.json({ 
      message: 'Rating submitted successfully',
      rating: newRating
    });

  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get counselor's average rating
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const counselorId = searchParams.get('counselorId');

    if (!counselorId) {
      return NextResponse.json({ error: 'Counselor ID required' }, { status: 400 });
    }

    await dbConnect();

    // Calculate average rating
    const ratings = await Rating.find({ counselorId });
    
    if (ratings.length === 0) {
      return NextResponse.json({ 
        averageRating: 0, 
        totalRatings: 0,
        ratings: []
      });
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = (totalRating / ratings.length).toFixed(1);

    // Get recent ratings with student info
    const recentRatings = await Rating.find({ counselorId })
      .populate('studentId', 'profile.displayName')
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      averageRating: parseFloat(averageRating),
      totalRatings: ratings.length,
      ratings: recentRatings
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
