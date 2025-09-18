import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { bookingId, studentId, counselorId } = await req.json();

    if (!bookingId || !studentId || !counselorId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get the Daily.co room URL from environment variables
    const dailyRoomUrl = process.env.DAILY_ROOM_URL;
    
    if (!dailyRoomUrl) {
      return NextResponse.json(
        { success: false, error: "Daily.co room URL not configured" },
        { status: 500 }
      );
    }

    // For now, we'll use a single room URL. In production, you might want to:
    // 1. Create unique rooms for each session using Daily.co REST API
    // 2. Or use room parameters to create session-specific rooms
    
    // Create a unique room name using the booking ID
    const roomName = `session-${bookingId}`;
    const roomUrl = `${dailyRoomUrl}/${roomName}`;

    // Optional: If you have Daily.co API key, you can create rooms programmatically
    // const DAILY_API_KEY = process.env.DAILY_API_KEY;
    // if (DAILY_API_KEY) {
    //   const response = await fetch('https://api.daily.co/v1/rooms', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${DAILY_API_KEY}`
    //     },
    //     body: JSON.stringify({
    //       name: roomName,
    //       properties: {
    //         max_participants: 2, // Only student and counselor
    //         enable_screenshare: true,
    //         enable_chat: true,
    //         start_video_off: false,
    //         start_audio_off: false,
    //       }
    //     })
    //   });
    //   
    //   const roomData = await response.json();
    //   if (roomData.url) {
    //     roomUrl = roomData.url;
    //   }
    // }

    return NextResponse.json({
      success: true,
      roomUrl,
      roomName,
      participants: {
        studentId,
        counselorId
      }
    });

  } catch (error) {
    console.error("Error creating video room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create video room" },
      { status: 500 }
    );
  }
}
