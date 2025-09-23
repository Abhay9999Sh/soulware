import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, CounselorProfile } from '@/lib/models';
import mongoose from 'mongoose'; // Import mongoose to access helper functions

export async function DELETE(request, { params }) {
  await dbConnect();
  
  // Safely access the id to prevent errors if params is not immediately available.
  const id = params?.id;

  // --- VALIDATE THE INCOMING ID ---
  // This check correctly handles cases where id is undefined or malformed.
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: 'Invalid or missing counselor ID provided.' },
      { status: 400 } // 400 Bad Request is the correct status code.
    );
  }

  try {
    // To ensure data integrity, it's good practice to check if the user exists first.
    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      return NextResponse.json({ error: 'Counselor not found.' }, { status: 404 });
    }

    // Proceed with deletion
    // It's okay if a counselor profile doesn't exist, so we don't need to check for it.
    await CounselorProfile.findOneAndDelete({ userId: id });
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Counselor deleted successfully' });
  } catch (error) {
    console.error("Failed to delete counselor:", error);
    // This will now only catch unexpected server errors, not bad IDs.
    return NextResponse.json({ error: 'Internal Server Error while deleting counselor.' }, { status: 500 });
  }
}

