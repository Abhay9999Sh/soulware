"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function BookingForm() {
  const { user } = useUser();
  const router = useRouter();
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [form, setForm] = useState({
    counselorId: "",
    mode: "in-person",
    preferredDate: "",
    timeSlot: "",
    isAnonymous: false,
  });

  // Time slots available - different for chat vs in-person
  const inPersonTimeSlots = [
    { value: "09:00-10:00", label: "9:00 AM - 10:00 AM" },
    { value: "10:00-11:00", label: "10:00 AM - 11:00 AM" },
    { value: "11:00-12:00", label: "11:00 AM - 12:00 PM" },
    { value: "14:00-15:00", label: "2:00 PM - 3:00 PM" },
    { value: "15:00-16:00", label: "3:00 PM - 4:00 PM" },
    { value: "16:00-17:00", label: "4:00 PM - 5:00 PM" },
    { value: "17:00-18:00", label: "5:00 PM - 6:00 PM" },
  ];

  const chatTimeSlots = [
    { value: "10:00-11:00", label: "10:00 AM - 11:00 AM" },
    { value: "11:00-12:00", label: "11:00 AM - 12:00 PM" },
    { value: "12:00-13:00", label: "12:00 PM - 1:00 PM" },
    { value: "13:00-14:00", label: "1:00 PM - 2:00 PM" },
    { value: "14:00-15:00", label: "2:00 PM - 3:00 PM" },
    { value: "15:00-16:00", label: "3:00 PM - 4:00 PM" },
    { value: "16:00-17:00", label: "4:00 PM - 5:00 PM" },
    { value: "17:00-18:00", label: "5:00 PM - 6:00 PM" },
    { value: "18:00-19:00", label: "6:00 PM - 7:00 PM" },
    { value: "19:00-20:00", label: "7:00 PM - 8:00 PM" },
    { value: "20:00-21:00", label: "8:00 PM - 9:00 PM" },
    { value: "21:00-22:00", label: "9:00 PM - 10:00 PM" },
  ];

  const timeSlots = form.mode === "chat" ? chatTimeSlots : inPersonTimeSlots;

  // Generate date options (today + next 14 days)
  const getDateOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      let label;
      if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";
      else label = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      
      options.push({
        value: date.toISOString().split('T')[0],
        label: label
      });
    }
    
    return options;
  };

  // Fetch counselors on component mount
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await fetch("/api/profile/counselor");
        if (res.ok) {
          const data = await res.json();
          setCounselors(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching counselors:", error);
      }
    };

    fetchCounselors();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      
      // Clear time slot when mode changes
      if (name === "mode") {
        newForm.timeSlot = "";
      }
      
      return newForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time to create slot
      const selectedDate = new Date(form.preferredDate);
      const [startTime] = form.timeSlot.split('-');
      const [hours, minutes] = startTime.split(':');
      selectedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const bookingData = {
        counselorId: form.counselorId,
        mode: form.mode,
        slot: selectedDate.toISOString(),
        isAnonymous: form.isAnonymous,
        studentId: user?.id,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (data.success) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          router.push("/dashboard/student");
        }, 3000);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="max-w-md mx-auto py-10">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Request Sent!</h2>
          <p className="text-green-700 mb-4">
            Your session request has been submitted successfully. The counselor will review and confirm your booking.
          </p>
          <p className="text-sm text-green-600">
            Redirecting to your dashboard in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Book Confidential Session</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        {/* Counselor Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Select Counselor</label>
          <select
            name="counselorId"
            value={form.counselorId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choose a counselor...</option>
            {counselors.map((counselor) => (
              <option key={counselor._id} value={counselor.userId}>
                👨‍⚕️ {counselor.name} - {counselor.specialization} ({counselor.department})
              </option>
            ))}
          </select>
          {counselors.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">Loading counselors...</p>
          )}
        </div>

        {/* Session Mode */}
        <div>
          <label className="block text-sm font-medium mb-3">Session Mode</label>
          <div className="grid grid-cols-1 gap-3">
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="mode"
                value="in-person"
                checked={form.mode === "in-person"}
                onChange={handleChange}
                className="mr-3"
              />
              <div>
                <span className="font-medium">🏢 In-Person Meeting</span>
                <p className="text-sm text-gray-600">Face-to-face session at counseling center</p>
              </div>
            </label>
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="mode"
                value="chat"
                checked={form.mode === "chat"}
                onChange={handleChange}
                className="mr-3"
              />
              <div>
                <span className="font-medium">💬 Chat Session</span>
                <p className="text-sm text-gray-600">Private text-based counseling session</p>
              </div>
            </label>
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-not-allowed opacity-50">
              <input
                type="radio"
                name="mode"
                value="call"
                disabled
                className="mr-3"
              />
              <div>
                <span className="font-medium">📞 Voice Call</span>
                <p className="text-sm text-gray-600">Coming Soon - Phone counseling</p>
              </div>
            </label>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Preferred Date</label>
          <select
            name="preferredDate"
            value={form.preferredDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a date...</option>
            {getDateOptions().map((option) => (
              <option key={option.value} value={option.value}>
                📅 {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slot Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Preferred Time Slot</label>
          <select
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a time slot...</option>
            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                🕐 {slot.label}
              </option>
            ))}
          </select>
        </div>

        {/* Anonymous Booking */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={form.isAnonymous}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <span className="font-medium">🔒 Book Anonymously</span>
              <p className="text-sm text-gray-600 mt-1">
                Your identity will be hidden from the counselor. Only session details will be shared.
              </p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Submitting Request..." : "📝 Submit Booking Request"}
        </button>
      </form>
    </div>
  );
}
