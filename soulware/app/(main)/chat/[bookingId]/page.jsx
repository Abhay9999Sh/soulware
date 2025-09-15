import ChatRoom from "@/components/ChatRoom";
import { notFound } from "next/navigation";

export default function ChatRoomPage({ params }) {
  const { bookingId } = params;

  // Validate bookingId format (assuming MongoDB ObjectId)
  if (!bookingId || bookingId.length !== 24) {
    notFound();
  }

  return <ChatRoom bookingId={bookingId} />;
}

export const metadata = {
  title: "Chat Session - Soulware",
  description: "Real-time chat with your counselor",
};