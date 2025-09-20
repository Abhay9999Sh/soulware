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

    // Get appointments from bookings collection using clerkId directly
    const appointments = await db.collection('bookings').find({
      counselorId: clerkId,
      status: { $in: ['pending', 'accepted', 'completed'] }
    }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to fetch counselor appointments:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}