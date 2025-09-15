"use client"; 
import React, { useState, useEffect } from "react"; 
import { useUser } from "@clerk/nextjs";

export default function Page() {
    const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [counselorProfile, setCounselorProfile] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilityForm, setAvailabilityForm] = useState({
    availableDays: [],
    inPersonTimeSlots: [],
    chatVideoTimeSlots: [],
    unavailableDates: "",
    unavailableTimes: ""
  });

  // Helper functions to safely handle booking data
  const getSessionType = (booking) => {
    const type = booking?.mode || booking?.type || "chat";
    return type;
  };

  const getSessionTypeDisplay = (booking) => {
    const type = getSessionType(booking);
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getSessionTypeIcon = (booking) => {
    const type = getSessionType(booking);
    switch (type) {
      case "video":
        return "📹";
      case "in-person":
        return "🏢";
      case "chat":
      default:
        return "💬";
    }
  };

  const getStatusDisplay = (booking) => {
    const status = booking?.status || "pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Request notification permission on load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`/api/bookings?counselorId=${user.id}`);
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

    const fetchCounselorProfile = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`/api/profile/counselor?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setCounselorProfile(data);
            if (data.availableSlots) {
              setAvailabilityForm({
                availableDays: data.availableDays || [],
                timeSlots: data.timeSlots || [],
                unavailableDates: data.unavailableDates ? data.unavailableDates.join(", ") : ""
              });
            }
          }
        } catch (error) {
          console.error("Error fetching counselor profile:", error);
        }
      }
    };

    fetchBookings();
    fetchCounselorProfile();
  }, [user]);

  // Real-time polling for new requests (every 5 seconds)
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bookings?counselorId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          
          // Check for new pending requests
          const newPendingCount = data.filter(b => b.status === "pending").length;
          const currentPendingCount = bookings.filter(b => b.status === "pending").length;
          
          if (newPendingCount > currentPendingCount) {
            // Play notification sound or show alert
            if (typeof window !== 'undefined' && window.Notification && Notification.permission === "granted") {
              new Notification("New Chat Request!", {
                body: "A student is requesting to chat with you",
                icon: "/favicon.ico"
              });
            }
          }
          
          setBookings(data);
        }
      } catch (error) {
        console.error("Error auto-refreshing bookings:", error);
      }
    }, 5000); // Check every 5 seconds for faster real-time updates

    return () => clearInterval(interval);
  }, [user, bookings]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
          updatedBy: user.id
        }),
      });

      if (res.ok) {
        // Refresh bookings
        const updatedRes = await fetch(`/api/bookings?counselorId=${user.id}`);
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setBookings(updatedData);
        }
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleAvailabilityUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...availabilityForm,
        unavailableDates: availabilityForm.unavailableDates 
          ? availabilityForm.unavailableDates.split(",").map(d => d.trim())
          : []
      };

      const res = await fetch("/api/profile/counselor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          ...updateData
        }),
      });

      if (res.ok) {
        setShowAvailabilityModal(false);
        alert("Availability updated successfully!");
        // Refresh counselor profile
        const profileRes = await fetch(`/api/profile/counselor?userId=${user.id}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setCounselorProfile(profileData);
        }
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Error updating availability");
    }
  };

  const handleAvailabilityChange = (field, value) => {
    setAvailabilityForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setAvailabilityForm(prev => {
      const currentFieldValue = prev[field] || []; // Ensure it's an array
      return {
        ...prev,
        [field]: currentFieldValue.includes(value)
          ? currentFieldValue.filter(item => item !== value)
          : [...currentFieldValue, value]
      };
    });
  };

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

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted");
  const otherBookings = bookings.filter((b) => b.status !== "pending" && b.status !== "accepted");

  // Time slots for in-person meetings (10 AM - 5 PM)
  const inPersonTimeSlots = [
    "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", 
    "14:00-15:00", "15:00-16:00", "16:00-17:00"
  ];

  // Time slots for chat/video meetings (10 AM - 10 PM)
  const chatVideoTimeSlots = [
    "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", 
    "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
    "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"
  ];

  const dayOptions = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Counselor Dashboard</h1>
          {counselorProfile && (
            <p className="text-gray-600 mt-1">
              Welcome back, {counselorProfile.name} - {counselorProfile.specialization}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAvailabilityModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          ⚙️ Manage Availability
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition ${
            activeTab === "requests"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          🔔 Pending Requests ({pendingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition ${
            activeTab === "upcoming"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📅 Upcoming Sessions ({acceptedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition ${
            activeTab === "history"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📊 Session History ({otherBookings.length})
        </button>
      </div>

      {/* Pending Requests Tab */}
      {activeTab === "requests" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-orange-600 flex items-center gap-2">
            🔔 Pending Requests ({pendingBookings.length})
          </h2>
          
          {pendingBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No pending requests</p>
              <p className="text-sm text-gray-500 mt-1">New booking requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border-2 border-orange-200 rounded-lg p-6 bg-orange-50 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">NEW</span>
                        <h3 className="font-bold text-lg">
                          {getSessionTypeIcon(booking)} {getSessionTypeDisplay(booking)} Session Request
                        </h3>
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          📅 {new Date(booking.slot).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm font-medium text-gray-700">
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
                          {booking.isAnonymous ? "🔒 Anonymous Request (Student identity hidden)" : "👤 Regular Request"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Requested on: {new Date(booking.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-md border-l-4 border-orange-400">
                        <p className="text-sm text-gray-700">
                          <strong>Action Required:</strong> Please review this booking request and confirm or decline the appointment.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => handleStatusUpdate(booking._id, "accepted")}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-md"
                      >
                        ✅ Accept Session
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking._id, "rejected")}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-md"
                      >
                        ❌ Decline Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upcoming Sessions Tab */}
      {activeTab === "upcoming" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-green-600 flex items-center gap-2">
            📅 Upcoming Sessions ({acceptedBookings.length})
          </h2>
          
          {acceptedBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No upcoming sessions</p>
              <p className="text-sm text-gray-500 mt-1">Accepted bookings will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {acceptedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border border-green-200 rounded-lg p-6 bg-green-50 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        {getSessionTypeIcon(booking)} {getSessionTypeDisplay(booking)} Session
                      </h3>
                      
                      <div className="space-y-1 mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          📅 {new Date(booking.slot).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm font-medium text-gray-700">
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
                          {booking.isAnonymous ? "🔒 Anonymous Session" : "👤 Regular Session"}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-md border-l-4 border-green-400">
                        <p className="text-sm text-green-700 mb-3">
                          ✅ <strong>Session Confirmed:</strong> Student has been notified. Please be prepared for the scheduled session.
                          {booking.mode === "chat" && " You can now start the chat session."}
                        </p>
                        {booking.mode === "chat" && (
                          <div className="flex gap-2">
                            <a
                              href={`/chat/${booking._id}`}
                              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                            >
                              💬 Start Chat Session
                            </a>
                            <a
                              href={`/chat-history/${booking._id}`}
                              className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
                            >
                              📜 View Chat History
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        ✅ Confirmed
                      </span>
                      <button
                        onClick={() => handleStatusUpdate(booking._id, "completed")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-md"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Session History Tab */}
      {activeTab === "history" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-blue-600 flex items-center gap-2">
            📊 Session History ({otherBookings.length})
          </h2>
          
          {otherBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No session history</p>
              <p className="text-sm text-gray-500 mt-1">Completed and rejected sessions will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {otherBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">
                        {getSessionTypeIcon(booking)} {getSessionTypeDisplay(booking)} Session
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
                        {booking.isAnonymous ? "🔒 Anonymous Session" : "👤 Regular Session"}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                      >
                        {getStatusDisplay(booking)}
                      </span>
                      
                      {booking.status === "completed" && (
                        <div className="text-xs text-blue-600">
                          <p>🎉 Session Completed</p>
                          {booking.mode === "chat" && (
                            <a
                              href={`/chat-history/${booking._id}`}
                              className="inline-flex items-center gap-1 mt-1 text-blue-600 hover:text-blue-800 underline"
                            >
                              📜 View Chat History
                            </a>
                          )}
                        </div>
                      )}
                      {booking.status === "rejected" && (
                        <p className="text-xs text-red-600">❌ Session Declined</p>
                      )}
                      {booking.status === "cancelled" && (
                        <p className="text-xs text-gray-600">🚫 Session Cancelled</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Availability Management Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">⚙️ Manage Availability</h2>
            
            <form onSubmit={handleAvailabilityUpdate} className="space-y-6">
              {/* Available Days */}
              <div>
                <label className="block text-sm font-medium mb-3">Available Days</label>
                <div className="grid grid-cols-2 gap-2">
                  {dayOptions.map((day) => (
                    <label key={day} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={availabilityForm.availableDays?.includes(day) || false}
                        onChange={() => handleCheckboxChange("availableDays", day)}
                        className="mr-2"
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In-Person Time Slots */}
              <div>
                <label className="block text-sm font-medium mb-3">🏢 In-Person Meeting Time Slots (10 AM - 5 PM)</label>
                <div className="grid grid-cols-2 gap-2">
                  {inPersonTimeSlots.map((slot) => (
                    <label key={slot} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={availabilityForm.inPersonTimeSlots?.includes(slot) || false}
                        onChange={() => handleCheckboxChange("inPersonTimeSlots", slot)}
                        className="mr-2"
                      />
                      <span className="text-sm">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Chat/Video Time Slots */}
              <div>
                <label className="block text-sm font-medium mb-3">💬 Chat/Video Call Time Slots (10 AM - 10 PM)</label>
                <div className="grid grid-cols-3 gap-2">
                  {chatVideoTimeSlots.map((slot) => (
                    <label key={slot} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={availabilityForm.chatVideoTimeSlots?.includes(slot) || false}
                        onChange={() => handleCheckboxChange("chatVideoTimeSlots", slot)}
                        className="mr-2"
                      />
                      <span className="text-sm">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Unavailable Dates */}
              <div>
                <label className="block text-sm font-medium mb-2">📅 Unavailable Dates</label>
                <textarea
                  value={availabilityForm.unavailableDates}
                  onChange={(e) => handleAvailabilityChange("unavailableDates", e.target.value)}
                  placeholder="Enter dates you're unavailable (e.g., 2025-12-25, 2025-12-31)"
                  className="w-full border rounded-lg px-3 py-2 h-20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple dates with commas (YYYY-MM-DD format)
                </p>
              </div>

              {/* Unavailable Times */}
              <div>
                <label className="block text-sm font-medium mb-2">🕐 Unavailable Time Slots</label>
                <textarea
                  value={availabilityForm.unavailableTimes}
                  onChange={(e) => handleAvailabilityChange("unavailableTimes", e.target.value)}
                  placeholder="Enter specific time slots you're unavailable (e.g., 2025-12-25 14:00-15:00, 2025-12-26 16:00-17:00)"
                  className="w-full border rounded-lg px-3 py-2 h-20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: YYYY-MM-DD HH:MM-HH:MM, separate multiple entries with commas
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  💾 Save Availability
                </button>
                <button
                  type="button"
                  onClick={() => setShowAvailabilityModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>)
}