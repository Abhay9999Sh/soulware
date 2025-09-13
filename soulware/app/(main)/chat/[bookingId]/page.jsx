"use client";
import React from "react";
import { useParams } from "next/navigation";
import ChatRoom from "@/components/ChatRoom";

export default function ChatPage() {
  const params = useParams();
  const bookingId = params.bookingId;

  return <ChatRoom bookingId={bookingId} />;
}
