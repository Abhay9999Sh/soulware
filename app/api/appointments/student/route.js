import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // First, find the student's MongoDB _id using their clerkId
    const student = await db.collection('users').findOne({ clerkId });
    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    // Now, find appointments for this student and join with counselor details
    const appointments = await db.collection('appointments').aggregate([
      {
        $match: {
          studentId: new ObjectId(student._id),
          status: { $in: ['pending', 'confirmed'] } // Only show upcoming appointments
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'counselorId',
          foreignField: '_id',
          as: 'counselorInfo'
        }
      },
      {
        $unwind: '$counselorInfo' // Deconstructs the counselorInfo array
      },
      {
        $project: {
          _id: 1,
          scheduledFor: 1,
          status: 1,
          counselorName: '$counselorInfo.profile.displayName' // Get counselor's name
        }
      },
      {
        $sort: { scheduledFor: 1 } // Sort by the soonest
      }
    ]).toArray();


    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}