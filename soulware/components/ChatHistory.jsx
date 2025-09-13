"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function ChatHistory({ bookingId }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [booking, setBooking] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!bookingId || !user?.id) return;

      try {
        setLoading(true);

        // Get booking details - the API returns an array, so we need to find our booking
        const bookingRes = await fetch(`/api/bookings`);
        if (!bookingRes.ok) throw new Error("Failed to fetch bookings");

        const allBookings = await bookingRes.json();
        const bookingData = allBookings.find(b => b._id === bookingId);
        
        if (!bookingData) throw new Error("Booking not found");
        setBooking(bookingData);

        // Only fetch chat if booking mode is chat
        if (bookingData.mode === "chat" && bookingData.chatId) {
          // Get chat details
          const chatRes = await fetch(`/api/chat?chatId=${bookingData.chatId}`);
          if (chatRes.ok) {
            const chatData = await chatRes.json();
            setChat(chatData.chat);

            // Identify other user
            const isStudent = chatData.chat.participants.student === user.id;
            const otherUserId = isStudent
              ? chatData.chat.participants.counselor
              : chatData.chat.participants.student;
            const otherUserRole = isStudent ? "counselor" : "student";

            // Fetch other user profile
            const profileRes = await fetch(
              `/api/profile/${otherUserRole}?userId=${otherUserId}`
            );
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              setOtherUser({ ...profileData, role: otherUserRole });
            }

            // Load messages
            const messagesRes = await fetch(`/api/messages?chatId=${bookingData.chatId}`);
            if (messagesRes.ok) {
              const messagesData = await messagesRes.json();
              setMessages(messagesData.messages || []);
            }
          }
        }
      } catch (error) {
        console.error("Chat history fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [bookingId, user]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading chat history...</p>
        </div>
      </div>
    );
  }

  // If not a chat booking
  if (booking?.mode !== "chat") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Chat Session</h3>
          <p className="text-gray-500">
            This booking was for {booking?.mode || "another mode"}, not chat.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If chat booking but no messages
  if (!messages || messages.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Chat History</h3>
          <p className="text-gray-500">
            No messages have been exchanged in this session yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If chat booking with messages
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {otherUser ? otherUser.name?.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold">
                Chat with{" "}
                {booking?.isAnonymous && chat?.participants.student !== user.id
                  ? "Anonymous Student"
                  : otherUser?.name || "Unknown User"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-3 w-3" />
                {new Date(booking.slot).toLocaleDateString()}
                <Clock className="h-3 w-3 ml-2" />
                {new Date(booking.slot).toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </Badge>
            {booking.status === "accepted" && chat?.isActive && (
              <Link href={`/chat/${bookingId}`}>
                <Button size="sm">Continue Chat</Button>
              </Link>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === user.id;
              const showAvatar =
                index === 0 || messages[index - 1].senderId !== message.senderId;

              return (
                <div
                  key={message._id}
                  className={`flex gap-3 ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isOwnMessage && showAvatar && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {otherUser?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {!isOwnMessage && !showAvatar && <div className="w-8" />}

                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 border"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatDistanceToNow(new Date(message.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
