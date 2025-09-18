import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';

export async function GET() {
  try {
    const { userId: clerkId } = await auth(); // Gets the Clerk ID of the logged-in user

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // First check if user exists in users collection
    let user = await db.collection('users').findOne({ clerkId });

    // If not found, check if they are a counselor
    const counselor = await db.collection('counselors').findOne({ 
      userId: clerkId 
    });
    
    if (counselor) {
      // Create or update user record as counselor
      const counselorUser = {
        clerkId,
        role: "counselor",
        email: counselor.email,
        name: counselor.name,
        department: counselor.department,
        specialization: counselor.specialization,
        updatedAt: new Date()
      };
      
      await db.collection('users').updateOne(
        { clerkId },
        { $set: counselorUser },
        { upsert: true }
      );
      
      return NextResponse.json(counselorUser);
    }
    
    // If user exists, return them
    if (user) {
      return NextResponse.json(user);
    }
    
    // Default to student role if no specific role found
    const defaultUser = {
      clerkId,
      role: "student",
      createdAt: new Date()
    };
    
    await db.collection('users').insertOne(defaultUser);
    return NextResponse.json(defaultUser);
    
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}