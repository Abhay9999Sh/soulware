import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongoose";
import { User, VolunteerProfile } from "@/lib/models";

// PATCH (update) a volunteer's profile
export async function PATCH(req) {
  await dbConnect();
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkId });
    if (!user || user.role !== 'volunteer') {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }
    
    const { areas } = await req.json();

    const updatedProfile = await VolunteerProfile.findOneAndUpdate(
      { userId: user._id },
      { $set: { areas: areas } },
      { new: true, upsert: true } // `upsert: true` creates the profile if it doesn't exist
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}