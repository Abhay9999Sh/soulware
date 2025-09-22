import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, PeerPost, Appointment, QuizResult, CounselorProfile } from "@/lib/models";
import mongoose from "mongoose";

// AI insights are now handled by a separate endpoint (/api/admin/ai-insights)
// This improves dashboard loading performance by removing the slow AI generation

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

    // --- Perform all detailed analytics queries in parallel (AI insights removed for performance) ---
    const [
      keyMetrics,
      quizAnalysis,
      topCommunityTopics,
      nominatedPosts,
      appointmentTrend
    ] = await Promise.all([
      // 1. Get Key Platform Metrics
      (async () => {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const activeCounselors = await User.countDocuments({ role: 'counselor' }); // Count ALL counselors, not just verified ones
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

      // 4. Get Nominated Posts for Admin Review (only posts nominated by volunteers)
      PeerPost.aggregate([
        { $match: { isNominated: true, isWeeklyHighlight: { $ne: true } } }, // Only nominated posts that aren't already highlighted
        { $lookup: { from: "peercomments", localField: "_id", foreignField: "postId", as: "comments" }},
        { $addFields: { engagementScore: { $add: [{ $size: "$upvotes" }, { $size: "$comments" }] }}},
        { $sort: { engagementScore: -1 } },
        { $limit: 10 }, // Show up to 10 nominated posts
        { $project: { title: 1, body: { $substr: ["$body", 0, 100] }, engagementScore: 1, upvoteCount: { $size: "$upvotes" }, commentCount: { $size: "$comments" }, createdAt: 1 } }
      ]),

      // 5. Track Appointment Booking Trends
      Appointment.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]).then(trend => trend.map(item => ({ date: item._id, appointments: item.count })))
    ]);

    // Return the comprehensive analytics object (AI insights now loaded separately)
    return NextResponse.json({
      keyMetrics,
      quizAnalysis,
      topCommunityTopics,
      mostEngagingPosts: nominatedPosts, // Keep the same key for backward compatibility
      appointmentTrend,
      loadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Failed to fetch detailed admin analytics:", error);
    return NextResponse.json({ error: "An error occurred while fetching analytics." }, { status: 500 });
  }
}

