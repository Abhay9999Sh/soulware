import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, Appointment } from "@/lib/models";

// Helper function to verify if the user is an admin
async function isAdmin(clerkId) {
    if (!clerkId) return false;
    const adminUser = await User.findOne({ clerkId });
    return adminUser && adminUser.role === 'admin';
}

// GET the latest student activities
export async function GET() {
  await dbConnect();
  try {
    const { userId: clerkId } = await auth();
    if (!await isAdmin(clerkId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch the 5 most recent student sign-ups
    const recentStudents = await User.find({ role: 'student' })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
    
    // Fetch the 5 most recent appointments created
    const recentAppointments = await Appointment.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('studentId', 'profile.displayName') // Get student's name
        .lean();

    // Format and combine the activities
    const activities = [
        ...recentStudents.map(student => ({
            type: 'new_user',
            message: `New student registered: ${student.email}`,
            date: student.createdAt
        })),
        ...recentAppointments.map(appt => ({
            type: 'new_appointment',
            message: `New appointment booked by ${appt.studentId?.profile?.displayName || 'a student'}.`,
            date: appt.createdAt
        }))
    ];

    // Sort all activities by date, descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({ activity: activities.slice(0, 10) });

  } catch (error) {
    console.error('Failed to fetch student activity:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
