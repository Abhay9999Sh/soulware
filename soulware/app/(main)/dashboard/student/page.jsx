"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`/api/bookings?studentId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setBookings(data);
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, [user]);

  // Auto-refresh bookings every 30 seconds for real-time feel
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bookings?studentId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Error auto-refreshing bookings:", error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "accepted": return "text-green-600 bg-green-100";
      case "rejected": return "text-red-600 bg-red-100";
      case "completed": return "text-blue-600 bg-blue-100";
      case "cancelled": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <Link
          href="/book-session"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Book New Session
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Booking History</h2>
        
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No bookings yet</p>
            <Link
              href="/book-session"
              className="text-blue-600 hover:underline"
            >
              Book your first session
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">
                      {booking.mode === "in-person" ? "🏢" : "💬"} {booking.mode.charAt(0).toUpperCase() + booking.mode.slice(1)} Session
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      📅 {new Date(booking.slot).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      🕐 {new Date(booking.slot).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                    {booking.mode === "in-person" && booking.roomNumber && (
                      <p className="text-sm text-blue-600 font-medium">
                        🏢 {booking.roomNumber}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {booking.isAnonymous ? "🔒 Anonymous Booking" : "👤 Regular Booking"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested: {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                {booking.status === "pending" && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">
                      ⏳ <strong>Booking Request Sent!</strong> Your counselor will review and confirm your session shortly.
                    </p>
                  </div>
                )}
                
                {booking.status === "accepted" && (
                  <div className="mt-3 p-3 bg-green-50 rounded-md border-l-4 border-green-400">
                    <p className="text-sm text-green-800 mb-3">
                      ✅ <strong>Session Confirmed!</strong> Your counselor has accepted your booking.
                      {booking.mode === "in-person" && " Please visit the counseling center at the scheduled time."}
                      {booking.mode === "chat" && " You can now start your chat session."}
                    </p>
                    {booking.mode === "chat" && (
                      <Link
                        href={`/chat/${booking._id}`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        💬 Start Chat Session
                      </Link>
                    )}
                  </div>
                )}
                
                {booking.status === "rejected" && (
                  <div className="mt-3 p-3 bg-red-50 rounded-md border-l-4 border-red-400">
                    <p className="text-sm text-red-800">
                      ❌ <strong>Booking Declined.</strong> The counselor couldn't accommodate this time slot. Please try booking a different time.
                    </p>
                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800 mb-3">
                      🎉 <strong>Session Completed!</strong> Thank you for attending your counseling session.
                    </p>
                    {booking.mode === "chat" && (
                      <Link
                        href={`/chat-history/${booking._id}`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        📜 View Chat History
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
