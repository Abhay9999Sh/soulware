import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { User, QuizResult } from "@/lib/models";
import { auth } from "@clerk/nextjs/server";

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

    // Get the quiz data from the request body
    const { score, severity, answers, quizType } = await req.json();

    // Create a new quiz result document
    const newQuizResult = new QuizResult({
      userId: user._id, // Use the user's MongoDB ObjectId
      score,
      severity,
      answers,
      quizType,
    });

    // Save the result to the database
    await newQuizResult.save();

    return NextResponse.json(newQuizResult, { status: 201 });
  } catch (error) {
    console.error("Failed to save quiz result:", error);
    return NextResponse.json({ error: "Failed to save quiz result" }, { status: 500 });
  }
}
