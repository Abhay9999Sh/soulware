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

    // Find the counselor's MongoDB _id
    const counselor = await db.collection('users').findOne({ clerkId });
    if (!counselor) {
      return NextResponse.json({ error: 'Counselor not found' }, { status: 404 });
    }

    // Find appointments for this counselor and join with student details
    const appointments = await db.collection('appointments').aggregate([
      {
        $match: {
          counselorId: new ObjectId(counselor._id),
          status: { $in: ['pending', 'confirmed'] }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      {
        $unwind: '$studentInfo'
      },
      {
        $project: {
          _id: 1,
          scheduledFor: 1,
          status: 1,
          studentName: '$studentInfo.profile.displayName'
        }
      },
      {
        $sort: { scheduledFor: 1 }
      }
    ]).toArray();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to fetch counselor appointments:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}