"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  Video, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MapPin,
  User
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchBookings, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?studentId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "rejected":
        return <XCircle className="w-5 h-5" />;
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "in-person":
        return <Users className="w-5 h-5" />;
      case "chat":
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <MessageCircle className="w-5 h-5" />;
    }
  };

  const handleJoinSession = (booking) => {
    if (booking.mode === "chat" || booking.type === "chat") {
      router.push(`/chat/${booking._id}`);
    } else if (booking.mode === "video" || booking.type === "video") {
      // For video sessions, you might want to redirect to a video call page
      router.push(`/video/${booking._id}`);
    } else {
      // For in-person sessions, show room details
      alert(`Please visit Room ${booking.roomNumber || "TBA"} at the scheduled time.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Here are your counseling sessions and bookings
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Button
            onClick={() => router.push("/counseling")}
            className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto flex flex-col items-center gap-3"
          >
            <MessageCircle className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">Start New Chat</div>
              <div className="text-sm opacity-90">Connect with a counselor</div>
            </div>
          </Button>

          <Button
            onClick={() => router.push("/counseling")}
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex flex-col items-center gap-3"
          >
            <Calendar className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">Book Session</div>
              <div className="text-sm opacity-90">Schedule an appointment</div>
            </div>
          </Button>

          <Button
            onClick={() => router.push("/counseling")}
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 h-auto flex flex-col items-center gap-3"
          >
            <Clock className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">View History</div>
              <div className="text-sm opacity-90">Past sessions</div>
            </div>
          </Button>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Sessions</h2>
          
          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No sessions yet</h3>
              <p className="text-gray-500">
                Start by booking a session or starting a chat with a counselor
              </p>
              <Button
                onClick={() => router.push("/counseling")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          {getSessionTypeIcon(booking.mode || booking.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 capitalize">
                            {booking.mode || booking.type || "Chat"} Session
                          </h3>
                          <p className="text-gray-600">
                            with {booking.counselorId?.firstName || "Counselor"} {booking.counselorId?.lastName || ""}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(booking.slot || booking.createdAt).toLocaleDateString()}
                            <Clock className="w-4 h-4 ml-3 mr-1" />
                            {new Date(booking.slot || booking.createdAt).toLocaleTimeString()}
                          </div>
                          {booking.roomNumber && (
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              Room {booking.roomNumber}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-2 text-sm font-medium capitalize">
                            {booking.status}
                          </span>
                        </div>
                        
                        {booking.status === "accepted" && (
                          <Button
                            onClick={() => handleJoinSession(booking)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Join Session
                          </Button>
                        )}
                        
                        {booking.status === "completed" && (
                          <Button
                            onClick={() => router.push(`/chat-history/${booking._id}`)}
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            View History
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {booking.notes}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}