import ChatHistory from "@/components/ChatHistory";
import { notFound } from "next/navigation";

export default function ChatHistoryPage({ params }) {
  const { bookingId } = params;

  // Validate bookingId format (assuming MongoDB ObjectId)
  if (!bookingId || bookingId.length !== 24) {
    notFound();
  }

  return <ChatHistory bookingId={bookingId} />;
}

export const metadata = {
  title: "Chat History - Soulware",
  description: "View your chat history with counselor",
};