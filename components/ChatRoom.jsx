"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MoreVertical, ArrowLeft, Smile } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import EmojiPicker from "emoji-picker-react";
import { useRealtimeSocket } from "@/lib/hooks/useRealtimeSocket";

export default function ChatRoom({ bookingId }) {
  const { user } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [booking, setBooking] = useState(null);
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [sessionEndedBy, setSessionEndedBy] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { socket, socketConnected } = useRealtimeSocket(user?.id, chat?._id?.toString());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup socket listeners
  useEffect(() => {
    if (socket && user?.id) {
      console.log("Setting up socket for user:", user.id);
      socket.emit("setup", { userId: user.id });

      socket.on("typing", () => setOtherUserTyping(true));
      socket.on("stop typing", () => setOtherUserTyping(false));

      socket.on("message received", (newMessage) => {
        console.log("Message received:", newMessage);
        setMessages((prev) => [...prev, newMessage]);
      });

      socket.on("session ended", ({ endedBy, userRole }) => {
        setSessionEndedBy({ endedBy, userRole });
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          const currentUserRole = chat?.participants.student === user.id ? "student" : "counselor";
          router.push(`/dashboard/${currentUserRole}`);
        }, 3000);
      });

      return () => {
        socket.off("typing");
        socket.off("stop typing");
        socket.off("message received");
        socket.off("session ended");
        setSessionEndedBy(null);
      };
    }
  }, [socket, user, chat, router]);

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      if (!bookingId || !user?.id) return;

      try {
        setLoading(true);

        // Get booking details
        const bookingRes = await fetch(`/api/bookings?bookingId=${bookingId}`);
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json();
          setBooking(bookingData);
        }

        // Create or get chat
        const chatRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        if (chatRes.ok) {
          const chatData = await chatRes.json();
          setChat(chatData.chat);

          // Other user info
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

          // Join chat room
          if (socket) {
            socket.emit("join chat", chatData.chat._id.toString());
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
        console.error("Chat initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [bookingId, user, socket]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chat) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: chat._id.toString(),
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // DON'T add message locally - let socket handle it to avoid duplicates
        setNewMessage("");
        setShowEmojiPicker(false);

        // Emit to socket
        if (socket) {
          socket.emit("new message", {
            chatId: chat._id.toString(),
            message: data.message,
          });
          socket.emit("stop typing", chat._id.toString());
        }
      }
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  // Typing logic
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !chat) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", chat._id.toString());
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", chat._id.toString());
      setIsTyping(false);
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const handleEndSession = () => {
    setShowEndSessionDialog(true);
  };

  const confirmEndSession = async () => {
    try {
      // Emit to socket so other user knows session is ending
      if (socket && chat?._id) {
        const userRole = chat.participants.student === user.id ? "student" : "counselor";
        const endedByName = userRole === "student" ? "Student" : "Counselor";
        
        socket.emit("end session", { 
          chatId: chat._id.toString(),
          endedBy: endedByName,
          userRole: userRole
        });
      }

      await fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: chat._id.toString(),
          isActive: false,
        }),
      });

      await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          status: "completed",
        }),
      });

      const userRole =
        chat.participants.student === user.id ? "student" : "counselor";
      router.push(`/dashboard/${userRole}`);
    } catch (error) {
      console.error("End session error:", error);
    } finally {
      setShowEndSessionDialog(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Card className="rounded-none border-l-0 border-r-0 border-t-0">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <Avatar>
                <AvatarFallback>
                  {otherUser ? otherUser.name?.charAt(0) : "?"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold">
                  {booking?.isAnonymous &&
                  chat?.participants.student !== user.id
                    ? "Anonymous Student"
                    : otherUser?.name || "Loading..."}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {otherUser?.role === "counselor" ? "Counselor" : "Student"}
                  </Badge>
                  {booking && booking.slot && (
                    <span className="text-xs text-gray-500">
                      {new Date(booking.slot).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEndSession}>
                End Session
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message, index) => {
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
            })}

            {otherUserTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {otherUser?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-200 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 z-50">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      {/* Input */}
      <Card className="rounded-none border-l-0 border-r-0 border-b-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-4 w-4" />
            </Button>

            <Input
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />

            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Ended Notification */}
      {sessionEndedBy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Session Ended
              </h3>
              <p className="text-gray-600">
                The <strong>{sessionEndedBy.endedBy}</strong> has ended this session.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                You will be redirected to your dashboard shortly...
              </p>
            </div>
            <Button 
              onClick={() => {
                const userRole = chat?.participants.student === user.id ? "student" : "counselor";
                router.push(`/dashboard/${userRole}`);
              }}
              className="w-full"
            >
              Go to Dashboard Now
            </Button>
          </div>
        </div>
      )}

      {/* End Session Confirmation Dialog */}
      {showEndSessionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">End Chat Session?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this chat session? This action cannot be undone and both users will be redirected to their dashboard.
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowEndSessionDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmEndSession}
              >
                End Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}