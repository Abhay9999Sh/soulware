import VideoCall from "@/components/VideoCall";
import { notFound } from "next/navigation";

export default async function VideoCallPage({ params }) {
  const { bookingId } = await params;

  // Validate bookingId format (assuming MongoDB ObjectId)
  if (!bookingId || bookingId.length !== 24) {
    notFound();
  }

  return <VideoCall bookingId={bookingId} />;
}

export const metadata = {
  title: "Video Call - Soulware",
  description: "Video counseling session",
};
