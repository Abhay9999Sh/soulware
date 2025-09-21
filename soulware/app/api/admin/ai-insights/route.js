import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, PeerPost, QuizResult } from "@/lib/models";

// --- AI Helper Function (moved from dashboard route) ---
async function getAIInsights(posts, quizzes) {
  console.log("🤖 Generating AI insights from post and quiz data...");
  if ((!posts || posts.length === 0) && (!quizzes || quizzes.length === 0)) {
    return {
      commonIssues: ["No recent activity"],
      summary: "There is not enough recent data to generate an AI summary."
    };
  }

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    console.error("❌ Gemini API key is not configured.");
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
    console.log("📡 Calling Gemini API for AI insights...");
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);
    
    const result = await response.json();
    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) throw new Error("Invalid response from AI.");
    
    const aiInsights = JSON.parse(jsonText);
    console.log("✅ AI insights generated successfully");
    return aiInsights;
    
  } catch (error) {
    console.error("❌ Error calling Gemini API for analytics:", error);
    return {
      commonIssues: ["Analysis Error"],
      summary: "Could not generate AI insights at this time due to a technical error."
    };
  }
}

// GET AI insights separately from main dashboard data
export async function GET() {
  await dbConnect();
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Security Check: Verify the user is an admin
    const adminUser = await User.findOne({ clerkId });
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden: Access is restricted to administrators." }, { status: 403 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log("🔍 Fetching recent data for AI analysis...");
    
    // Fetch recent posts and quiz results for AI analysis
    const [recentPostsForAI, recentQuizzesForAI] = await Promise.all([
      PeerPost.find({ createdAt: { $gte: thirtyDaysAgo } }, 'body').limit(50).lean(),
      QuizResult.find({ createdAt: { $gte: thirtyDaysAgo } }, 'severity answers').limit(50).lean()
    ]);

    console.log(`📊 Found ${recentPostsForAI.length} posts and ${recentQuizzesForAI.length} quiz results`);

    // Generate AI insights
    const aiAnalysis = await getAIInsights(recentPostsForAI, recentQuizzesForAI);

    return NextResponse.json({ 
      aiAnalysis,
      dataPoints: {
        postsAnalyzed: recentPostsForAI.length,
        quizzesAnalyzed: recentQuizzesForAI.length
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Failed to generate AI insights:", error);
    return NextResponse.json({ 
      error: "An error occurred while generating AI insights.",
      details: error.message 
    }, { status: 500 });
  }
}
