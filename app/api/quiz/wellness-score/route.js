import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Fetch user's wellness data
    const wellnessData = await db.collection('wellness_scores').findOne({ 
      userId: userId 
    });

    if (wellnessData) {
      return NextResponse.json({ 
        wellnessScore: wellnessData.score,
        lastUpdated: wellnessData.updatedAt,
        factors: wellnessData.factors
      });
    }

    // If no wellness data found, return null to trigger calculation
    return NextResponse.json({ wellnessScore: null });

  } catch (error) {
    console.error('Error fetching wellness score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { wellnessScore, factors } = await request.json();

    if (wellnessScore === undefined || wellnessScore < 0 || wellnessScore > 100) {
      return NextResponse.json({ error: 'Invalid wellness score' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Update or create wellness score
    const result = await db.collection('wellness_scores').updateOne(
      { userId: userId },
      { 
        $set: { 
          score: wellnessScore,
          factors: factors,
          updatedAt: new Date()
        },
        $setOnInsert: {
          userId: userId,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      wellnessScore: wellnessScore,
      updated: result.modifiedCount > 0 || result.upsertedCount > 0
    });

  } catch (error) {
    console.error('Error saving wellness score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
