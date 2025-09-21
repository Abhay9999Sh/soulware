import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/backend';
import clientPromise from '@/lib/mongodb';

// Initialize Clerk client with secret key
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET() {
  try {
    const { userId: clerkId } = await auth(); // Gets the Clerk ID of the logged-in user

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

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
    
    // Get user details from Clerk to avoid email conflicts
    const clerkUser = await clerkClient.users.getUser(clerkId);
    
    // Default to student role if no specific role found
    const defaultUser = {
      clerkId,
      role: "student",
      email: clerkUser.emailAddresses[0]?.emailAddress || `user_${clerkId}@temp.local`, // Use actual email or unique temp email
      name: clerkUser.fullName || clerkUser.firstName || 'Student',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Use upsert to avoid duplicate key errors
    await db.collection('users').updateOne(
      { clerkId },
      { $set: defaultUser },
      { upsert: true }
    );
    return NextResponse.json(defaultUser);
    
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}