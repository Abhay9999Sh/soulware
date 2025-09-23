import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, CounselorProfile } from '@/lib/models';

export async function GET() {
  console.log('Starting counselors fetch...');
  try {
    await dbConnect();
    console.log('Database connected successfully');

    const counselors = await User.find({ role: 'counselor' }).lean();
    console.log(`Found ${counselors.length} counselors`);

    const counselorIds = counselors.map(c => c._id);
    console.log('Fetching counselor profiles...');
    const profiles = await CounselorProfile.find({ userId: { $in: counselorIds } }).lean();
    
    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));

    const formattedCounselors = counselors.map(c => {
      const profile = profileMap.get(c._id.toString());
      return {
        userId: c._id,
        // --- THIS IS THE FIX ---
        // Use `?.` to safely access displayName. If c.profile is undefined, it won't crash.
        name: c.profile?.displayName || 'Counselor', 
        qualification: profile?.qualification || 'Licensed Professional',
        isAvailable: true, 
      };
    });

    return NextResponse.json({ 
      items: formattedCounselors.map(c => ({ 
        ...c, 
        _id: c.userId // alias for frontend 
      })) 
    });
  } catch (error) {
    console.error("Failed to fetch counselors:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}