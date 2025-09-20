import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Fetch user's quiz score from starter quiz
    const quizResult = await db.collection('quiz_results').findOne({ 
      userId: userId,
      quizType: 'starter' // Only get starter quiz results
    }, {
      sort: { completedAt: -1 } // Get the most recent one
    });

    if (quizResult) {
      return NextResponse.json({ 
        score: quizResult.score,
        completedAt: quizResult.completedAt,
        quizType: quizResult.quizType
      });
    }

    // If no quiz taken yet, return null score
    return NextResponse.json({ score: null });

  } catch (error) {
    console.error('Error fetching quiz score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { score, answers, quizType = 'starter' } = await request.json();

    if (score === undefined || score < 0 || score > 100) {
      return NextResponse.json({ error: 'Invalid quiz score' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Save quiz result
    const quizResult = {
      userId: userId,
      score: score,
      answers: answers || {},
      quizType: quizType,
      completedAt: new Date(),
      createdAt: new Date()
    };

    const result = await db.collection('quiz_results').insertOne(quizResult);

    return NextResponse.json({ 
      success: true, 
      score: score,
      id: result.insertedId,
      completedAt: quizResult.completedAt
    });

  } catch (error) {
    console.error('Error saving quiz score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
