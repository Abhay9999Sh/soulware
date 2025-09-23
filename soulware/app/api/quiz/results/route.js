import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { User, QuizResult } from "@/lib/models";
import { auth } from "@clerk/nextjs/server";
import { normalizeScore } from "@/lib/questionnaires";

// POST a new quiz result
export async function POST(req) {
  await dbConnect();
  try {
    const { userId: clerkId } =await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in your database by their Clerk ID to get their MongoDB _id
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Get the comprehensive quiz data from the request body
    const { quizType, domainResults, wellnessScore, flags, answers, score, severity } = await req.json();

    // Calculate normalized scores for domain results
    const enhancedDomainResults = domainResults ? domainResults.map(result => ({
      ...result,
      normalizedScore: normalizeScore(result)
    })) : [];

    // Create a new quiz result document with comprehensive data
    const newQuizResult = new QuizResult({
      userId: user._id,
      quizType: quizType || 'PHQ-9',
      wellnessScore,
      domainResults: enhancedDomainResults,
      flags: flags || [],
      answers: answers || [],
      // Legacy fields for backward compatibility
      score: score || (domainResults && domainResults[0] ? domainResults[0].rawScore : 0),
      severity: severity || (domainResults && domainResults[0] ? domainResults[0].severity : 'Unknown')
    });

    // Save the result to the database
    await newQuizResult.save();

    return NextResponse.json(newQuizResult, { status: 201 });
  } catch (error) {
    console.error("Failed to save quiz result:", error);
    return NextResponse.json({ error: "Failed to save quiz result" }, { status: 500 });
  }
}
