import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User } from '@/lib/models';

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    console.error("Failed to delete volunteer:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}