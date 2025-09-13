"use client";
import React from "react";
import { useParams } from "next/navigation";
import ChatHistory from "@/components/ChatHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ChatHistoryPage() {
  const params = useParams();
  const bookingId = params.bookingId;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Chat History</h1>
      </div>
      
      <ChatHistory bookingId={bookingId} />
    </div>
  );
}
