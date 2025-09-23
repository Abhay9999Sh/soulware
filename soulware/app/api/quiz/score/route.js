import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, QuizResult } from '@/lib/models';
import { interpretWellnessScore } from '@/lib/questionnaires';

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

    // Fetch user's most recent quiz result (any type)
    const quizResult = await QuizResult.findOne({ 
      userId: user._id
    }).sort({ createdAt: -1 }); // Get the most recent one

    console.log('📊 Quiz result found:', quizResult);

    if (quizResult) {
      let wellnessScore;
      let domainScores = {};
      let flags = [];
      let interpretation = null;
      
      // Check if it's a comprehensive result with wellness score
      if (quizResult.wellnessScore !== undefined && quizResult.wellnessScore !== null) {
        wellnessScore = quizResult.wellnessScore;
        
        // Extract domain scores
        if (quizResult.domainResults && quizResult.domainResults.length > 0) {
          quizResult.domainResults.forEach(domain => {
            domainScores[domain.domain] = {
              score: domain.normalizedScore || 0,
              rawScore: domain.rawScore,
              severity: domain.severity,
              description: domain.description
            };
          });
        }
        
        flags = quizResult.flags || [];
        interpretation = interpretWellnessScore(wellnessScore);
      } else {
        // Legacy PHQ-9 only result - calculate wellness score
        wellnessScore = Math.round(((27 - (quizResult.score || 0)) / 27) * 100);
        interpretation = interpretWellnessScore(wellnessScore);
        
        // Create domain score for depression only
        domainScores.depression = {
          score: wellnessScore,
          rawScore: quizResult.score,
          severity: quizResult.severity,
          description: `PHQ-9 Depression Assessment: ${quizResult.severity}`
        };
      }
      
      return NextResponse.json({ 
        score: wellnessScore,
        domainScores,
        flags,
        interpretation,
        completedAt: quizResult.createdAt,
        quizType: quizResult.quizType,
        // Legacy fields
        rawScore: quizResult.score,
        severity: quizResult.severity
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

// Legacy POST endpoint for backward compatibility
export async function POST(request) {
  try {
    await dbConnect();
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      score, 
      answers, 
      quizType = 'PHQ-9', 
      severity,
      wellnessScore,
      domainResults,
      flags
    } = await request.json();

    // Find the user in the database by their Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new quiz result with comprehensive data
    const quizResult = new QuizResult({
      userId: user._id,
      quizType,
      wellnessScore,
      domainResults: domainResults || [],
      flags: flags || [],
      answers: answers || [],
      // Legacy fields for backward compatibility
      score: score || 0,
      severity: severity || 'Unknown'
    });

    await quizResult.save();

    // Calculate wellness score if not provided (legacy support)
    const finalWellnessScore = wellnessScore !== undefined 
      ? wellnessScore 
      : Math.round(((27 - (score || 0)) / 27) * 100);

    return NextResponse.json({ 
      success: true, 
      score: finalWellnessScore,
      wellnessScore: finalWellnessScore,
      domainResults: domainResults || [],
      flags: flags || [],
      id: quizResult._id,
      completedAt: quizResult.createdAt,
      // Legacy fields
      rawScore: score,
      severity: severity
    });

  } catch (error) {
    console.error('Error saving quiz score:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
