import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, CounselorProfile, Appointment } from "@/lib/models";

// Test endpoint to check actual database counts
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

    // Get detailed counts with breakdown
    const [
      totalStudents,
      totalCounselors,
      verifiedCounselors,
      totalAppointments,
      allUsers,
      allCounselorProfiles
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'counselor' }),
      CounselorProfile.countDocuments({ isVerified: true }),
      Appointment.countDocuments(),
      User.find({}, { role: 1, email: 1, createdAt: 1 }).lean(),
      CounselorProfile.find({}, { isVerified: 1, userId: 1 }).populate('userId', 'email role').lean()
    ]);

    // Group users by role for detailed breakdown
    const usersByRole = allUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      counts: {
        totalStudents,
        totalCounselors,
        verifiedCounselors,
        totalAppointments
      },
      breakdown: {
        usersByRole,
        totalUsers: allUsers.length,
        counselorProfiles: {
          total: allCounselorProfiles.length,
          verified: allCounselorProfiles.filter(cp => cp.isVerified).length,
          unverified: allCounselorProfiles.filter(cp => !cp.isVerified).length
        }
      },
      sampleUsers: allUsers.slice(0, 5),
      sampleCounselorProfiles: allCounselorProfiles.slice(0, 3),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Failed to fetch test counts:", error);
    return NextResponse.json({ 
      error: "An error occurred while fetching test counts.", 
      details: error.message 
    }, { status: 500 });
  }
}
