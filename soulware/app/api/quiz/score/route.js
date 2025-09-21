import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, QuizResult } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 Looking for quiz results for Clerk ID:', clerkId);

    // Find the user in the database by their Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      console.log('❌ User not found in database for Clerk ID:', clerkId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ Found user:', user._id);

    // Fetch user's quiz score from PHQ-9 quiz (which is the starter quiz)
    const quizResult = await QuizResult.findOne({ 
      userId: user._id,
      quizType: 'PHQ-9' // The starter quiz uses PHQ-9 type
    }).sort({ createdAt: -1 }); // Get the most recent one

    console.log('📊 Quiz result found:', quizResult);

    if (quizResult) {
      // Reverse PHQ-9 score: Higher depression = Lower wellness
      // PHQ-9: 0 (no depression) = 100% wellness, 27 (severe depression) = 0% wellness
      const wellnessScore = Math.round(((27 - quizResult.score) / 27) * 100);
      
      return NextResponse.json({ 
        score: wellnessScore,
        rawScore: quizResult.score,
        severity: quizResult.severity,
        completedAt: quizResult.createdAt,
        quizType: quizResult.quizType
      });
    }

    // If no quiz taken yet, return null score
    console.log('❌ No quiz results found for user');
    return NextResponse.json({ score: null });

  } catch (error) {
    console.error('💥 Error fetching quiz score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { score, answers, quizType = 'PHQ-9', severity } = await request.json();

    if (score === undefined || score < 0 || score > 27) {
      return NextResponse.json({ error: 'Invalid quiz score (must be 0-27 for PHQ-9)' }, { status: 400 });
    }

    // Find the user in the database by their Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new quiz result using Mongoose model
    const quizResult = new QuizResult({
      userId: user._id,
      score: score,
      severity: severity || 'Unknown',
      answers: answers || [],
      quizType: quizType
    });

    await quizResult.save();

    // Convert to wellness percentage (reversed scoring)
    const wellnessScore = Math.round(((27 - score) / 27) * 100);

    return NextResponse.json({ 
      success: true, 
      score: wellnessScore,
      rawScore: score,
      severity: severity,
      id: quizResult._id,
      completedAt: quizResult.createdAt
    });

  } catch (error) {
    console.error('Error saving quiz score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
