import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User } from '@/lib/models';

export async function GET() {
  console.log('Starting volunteers fetch...');
  try {
    await dbConnect();
    console.log('Database connected successfully');

    const volunteers = await User.find({ role: 'volunteer' })
      .select('profile email createdAt')
      .lean();
    console.log(`Found ${volunteers.length} volunteers`);

    const formattedVolunteers = volunteers.map(v => ({
      _id: v._id, // use _id for consistency with frontend
      name: v.profile?.displayName || 'Volunteer',
      email: v.email,
      joinedDate: v.createdAt,
    }));

    // Wrap inside { items: [...] }
    return NextResponse.json({ items: formattedVolunteers });
  } catch (error) {
    console.error("Failed to fetch volunteers:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
