import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Security Check: Verify user is an admin
    const adminUser = await db.collection('users').findOne({ clerkId });
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch stats in parallel
    const [totalUsers, pendingCounselors, pendingVolunteers, totalAppointments] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('counselorProfiles').countDocuments({ isVerified: false }),
      db.collection('volunteerProfiles').countDocuments({ isApproved: false }),
      db.collection('appointments').countDocuments()
    ]);
    
    return NextResponse.json({
      totalUsers,
      pendingApprovals: pendingCounselors + pendingVolunteers,
      totalAppointments
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}