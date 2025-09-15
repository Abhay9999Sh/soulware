"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ChatHistory({ bookingId }) {
  const { user } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [booking, setBooking] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!bookingId || !user?.id) return;

      try {
        setLoading(true);

        // Get booking details
        const bookingRes = await fetch(`/api/bookings?bookingId=${bookingId}`);
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json();
          setBooking(bookingData);
        }

        // Get chat
        const chatRes = await fetch(`/api/chat?bookingId=${bookingId}`);
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          setChat(chatData.chat);

          // Get other user info
          const isStudent = chatData.chat.participants.student === user.id;
          const otherUserId = isStudent
            ? chatData.chat.participants.counselor
            : chatData.chat.participants.student;
          const otherUserRole = isStudent ? "counselor" : "student";

          const profileRes = await fetch(
            `/api/profile/${otherUserRole}?userId=${otherUserId}`
          );
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setOtherUser({ ...profileData, role: otherUserRole });
          }

          // Load messages
          const messagesRes = await fetch(
            `/api/messages?chatId=${chatData.chat._id}`
          );
          if (messagesRes.ok) {
            const messagesData = await messagesRes.json();
            setMessages(messagesData.messages || []);
          }
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();
  }, [bookingId, user]);

  const goBack = () => {
    const userRole = chat?.participants.student === user.id ? "student" : "counselor";
    router.push(`/dashboard/${userRole}`);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading chat history...</p>
        </div>
      </div>
    );
  }

  if (!chat || !booking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Chat History Not Found</h2>
          <p className="text-gray-600 mb-4">This chat session could not be found.</p>
          <Button onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={goBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chat History
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Session with{" "}
                    {booking?.isAnonymous &&
                    chat?.participants.student !== user.id
                      ? "Anonymous Student"
                      : otherUser?.name || "Loading..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {otherUser?.role === "counselor" ? "Counselor" : "Student"}
                </Badge>
                <Badge 
                  variant={chat.isActive ? "default" : "secondary"}
                >
                  {chat.isActive ? "Active" : "Completed"}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Session Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Session Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.slot).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: false })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Messages</p>
                  <p className="text-sm text-gray-600">{messages.length} messages</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages in this chat session.
                  </div>
                ) : (
                  messages.map((message, index) => {
                    if (!message || !message.senderId) return null;
                    const isOwnMessage = message.senderId === user.id;
                    const showAvatar =
                      index === 0 ||
                      !messages[index - 1] ||
                      messages[index - 1].senderId !== message.senderId;

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
                              : "bg-white border shadow-sm"
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
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
