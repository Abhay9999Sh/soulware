import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, PeerPost, Appointment, QuizResult, CounselorProfile } from "@/lib/models";
import mongoose from "mongoose";

// --- AI Helper Function ---
// This function calls the Gemini API to analyze text from posts and quizzes.
async function getAIInsights(posts, quizzes) {
  console.log("Attempting to generate AI insights from post and quiz data...");
  if ((!posts || posts.length === 0) && (!quizzes || quizzes.length === 0)) {
    return {
      commonIssues: ["No recent activity"],
      summary: "There is not enough recent data to generate an AI summary."
    };
  }

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    console.error("Gemini API key is not configured.");
    return {
      commonIssues: ["Configuration Error"],
      summary: "AI analysis is unavailable due to a missing API key."
    };
  }

  // Combine post bodies and quiz answers into a single text block for analysis
  const postText = posts.map(p => `Post: "${p.body}"`).join("\n");
  const quizText = quizzes.map(q => 
    `Quiz Result (Severity: ${q.severity}):\n${q.answers.map(a => `- ${a.question}: ${a.answer}`).join("\n")}`
  ).join("\n\n");

  const combinedText = `ANONYMOUS COMMUNITY POSTS:\n${postText}\n\nANONYMOUS QUIZ RESULTS:\n${quizText}`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  const systemPrompt = `You are a psychological analyst for a student wellness platform. Your task is to analyze the following anonymous data from community posts and mental health quizzes (PHQ-9). Identify the most common underlying issues and provide a concise summary. Your response MUST be a valid JSON object with this exact structure:
  {
    "commonIssues": ["Issue 1", "Issue 2", "Issue 3"],
    "summary": "A brief, one-paragraph summary explaining the key trends and potential concerns observed in the data."
  }
  RULES:
  - The "commonIssues" array MUST contain the top 3-5 most prevalent psychological themes (e.g., "Academic Pressure", "Social Anxiety", "Symptoms of Depression").
  - The summary MUST be professional, objective, and focus on trends, not individual cases.`;

  const payload = {
    contents: [{ parts: [{ text: combinedText }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          commonIssues: { type: "ARRAY", items: { type: "STRING" } },
          summary: { type: "STRING" }
        },
      }
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);
    const result = await response.json();
    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) throw new Error("Invalid response from AI.");
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API for analytics:", error);
    return {
      commonIssues: ["Analysis Error"],
      summary: "Could not generate AI insights at this time due to a technical error."
    };
  }
}

// GET a comprehensive, anonymous analytics snapshot for the Admin Dashboard
export async function GET() {
  await dbConnect();
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Security Check: Verify the user is an admin before proceeding
    const adminUser = await User.findOne({ clerkId });
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden: Access is restricted to administrators." }, { status: 403 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // --- Perform all detailed analytics queries in parallel ---
    const [
      keyMetrics,
      quizAnalysis,
      topCommunityTopics,
      mostEngagingPosts,
      appointmentTrend,
      recentPostsForAI,
      recentQuizzesForAI
    ] = await Promise.all([
      // 1. Get Key Platform Metrics
      (async () => {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const activeCounselors = await CounselorProfile.countDocuments({ isVerified: true });
        const totalAppointments = await Appointment.countDocuments();
        return { totalStudents, activeCounselors, totalAppointments };
      })(),
      
      // 2. Analyze Student Wellness from PHQ-9 Quiz Results
      QuizResult.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$severity", count: { $sum: 1 } } },
        { $project: { _id: 0, name: "$_id", value: "$count" } },
        { $sort: { value: -1 } }
      ]),

      // 3. Find Top 5 Most Talked-About Topics from Post Tags
      PeerPost.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: "$_id", value: "$count" } }
      ]),

      // 4. Identify the Top 3 Most Engaging Posts
      PeerPost.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $lookup: { from: "peercomments", localField: "_id", foreignField: "postId", as: "comments" }},
        { $addFields: { engagementScore: { $add: [{ $size: "$upvotes" }, { $size: "$comments" }] }}},
        { $sort: { engagementScore: -1 } },
        { $limit: 3 },
        { $project: { title: 1, body: { $substr: ["$body", 0, 100] }, engagementScore: 1, upvoteCount: { $size: "$upvotes" }, commentCount: { $size: "$comments" } } }
      ]),

      // 5. Track Appointment Booking Trends
      Appointment.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]).then(trend => trend.map(item => ({ date: item._id, appointments: item.count }))),
      
      // 6. Get recent post text for AI analysis
      PeerPost.find({ createdAt: { $gte: thirtyDaysAgo } }, 'body').limit(50).lean(),
      
      // 7. Get recent quiz results for AI analysis
      QuizResult.find({ createdAt: { $gte: thirtyDaysAgo } }, 'severity answers').limit(50).lean()
    ]);

    // --- Generate AI Insights after fetching data ---
    const aiAnalysis = await getAIInsights(recentPostsForAI, recentQuizzesForAI);

    // Return the comprehensive analytics object
    return NextResponse.json({
      keyMetrics,
      quizAnalysis,
      topCommunityTopics,
      mostEngagingPosts,
      appointmentTrend,
      aiAnalysis // Add the AI analysis to the response
    });

  } catch (error) {
    console.error("Failed to fetch detailed admin analytics:", error);
    return NextResponse.json({ error: "An error occurred while fetching analytics." }, { status: 500 });
  }
}

