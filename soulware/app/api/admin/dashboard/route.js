import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, PeerPost, Appointment } from "@/lib/models";

// Helper function to get AI Insights using Gemini API
async function getAIInsights(posts) {
  console.log("Attempting to get AI insights...");
  if (!posts || posts.length === 0) {
    console.log("No posts provided for AI analysis.");
    return {
      sentiment: "Neutral",
      trendingTopics: ["No recent activity"],
      summary: "Not enough recent post data to generate insights."
    };
  }
  
  const apiKey = process.env.GEMINI_KEY;
  
  if (!apiKey) {
      console.error("Gemini API key is not configured in environment variables.");
      return {
          sentiment: "Unavailable",
          trendingTopics: ["Configuration Error"],
          summary: "AI analysis is not available due to a missing API key."
      };
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  const combinedPostText = posts.map(p => p.body).join("\n---\n");

  // --- FIX: A much stricter and more robust system prompt ---
  const systemPrompt = `You are an expert analyst for a student mental wellness app. Analyze the provided anonymous community posts. Your primary goal is to be concise and accurate. Your response MUST be a valid JSON object with this exact structure:
  {
    "sentiment": "Positive | Negative | Neutral | Slightly Negative",
    "trendingTopics": ["Topic 1", "Topic 2", "Topic 3"],
    "summary": "A brief, one-sentence summary of the key themes."
  }
  RULES:
  - The "trendingTopics" array MUST contain no more than 5 topics.
  - The topics MUST be directly related to the provided posts.
  - If the posts are too vague or short to determine clear topics, return an empty array for "trendingTopics".
  - Do not invent topics that are not present in the text.`;

  const payload = {
    contents: [{ parts: [{ text: `Here are the posts:\n${combinedPostText}` }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          sentiment: { type: "STRING" },
          trendingTopics: { type: "ARRAY", items: { type: "STRING" } },
          summary: { type: "STRING" }
        },
      }
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
        console.error("Gemini API Error:", response.status, response.statusText);
        const errorBody = await response.text();
        console.error("Raw Error Body:", errorBody);
        throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Successfully received response from Gemini API.");
    
    console.log("Full Gemini Candidate:", JSON.stringify(result.candidates?.[0], null, 2));

    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
        console.error("The 'text' field was missing in the Gemini response.");
        throw new Error("Invalid JSON response structure from AI.");
    }

    console.log("Raw JSON text from AI:", jsonText);
    return JSON.parse(jsonText);

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
        console.error("Gemini API call timed out.");
        return {
            sentiment: "Unavailable",
            trendingTopics: ["Timeout Error"],
            summary: "AI analysis took too long to respond."
        };
    }
    console.error("Error processing Gemini API response:", error);
    return {
        sentiment: "Unavailable",
        trendingTopics: ["Analysis Error"],
        summary: "Could not generate AI insights at this time."
    };
  }
}

// GET all necessary data for the Admin Dashboard
export async function GET() {
  console.log("[Admin API] Request received for dashboard data.");
  await dbConnect();
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminUser = await User.findOne({ clerkId });
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.log("[Admin API] User authenticated. Fetching data from DB...");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      totalAppointments,
      nominatedPosts,
      recentPosts,
      appointmentTrend
    ] = await Promise.all([
      User.countDocuments(),
      Appointment.countDocuments(),
      PeerPost.find({ isNominated: true, isWeeklyHighlight: { $ne: true } }).sort({ upvotes: -1 }).lean(),
      PeerPost.find({ createdAt: { $gte: sevenDaysAgo } }, 'body tags').limit(100).lean(), // Also fetch tags
      Appointment.aggregate([
          { $match: { scheduledFor: { $gte: sevenDaysAgo } } },
          { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$scheduledFor" } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
      ])
    ]);
    console.log("[Admin API] Database queries complete. Fetching AI insights...");

    const insights = await getAIInsights(recentPosts);
    console.log("[Admin API] AI insights generated. Preparing final response.");
    
    const formattedTrend = appointmentTrend.map(item => ({ date: item._id, appointments: item.count }));

    return NextResponse.json({
      stats: { totalUsers, totalAppointments },
      nominations: nominatedPosts,
      aiInsights: insights,
      analytics: { appointmentTrend: formattedTrend }
    });

  } catch (error) {
    console.error("[Admin API] CRITICAL ERROR:", error);
    return NextResponse.json({ error: "An error occurred while fetching dashboard data." }, { status: 500 });
  }
}

