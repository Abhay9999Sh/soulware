"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  Shield, 
  Clock, 
  User, 
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Video,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const CounselingPage = () => {
  const { user } = useUser();
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselorId, setSelectedCounselorId] = useState(null);
  
  const [requestStatus, setRequestStatus] = useState("idle"); // idle, pending, accepted, rejected, timeout
  const [pendingRequest, setPendingRequest] = useState(null);
  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
      date: "",
      time: "",
      notes: ""
  });
  
  const [loading, setLoading] = useState(true);
  
  // Fetch available counselors on component mount
  useEffect(() => {
    const fetchCounselors = async () => {
        try {
            const res = await fetch("/api/counselors");
            const data = await res.json();
            if (data && !data.error) {
                setCounselors(data);
                // Select the first available counselor by default
                if (data.length > 0) {
                    setSelectedCounselorId(data[0].userId);
                }
            }
        } catch (error) {
            console.error("Failed to fetch counselors:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchCounselors();
  }, []);

  const pollBookingStatus = (bookingId) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/bookings?bookingId=${bookingId}`);
        const booking = await response.json();
        
        if (booking.status === "accepted") {
          setRequestStatus("accepted");
          clearInterval(pollInterval);
          // Redirect to the chat room after a short delay
          setTimeout(() => {
            window.location.href = `/chat/${bookingId}`;
          }, 2000);
        } else if (booking.status === "rejected") {
          setRequestStatus("rejected");
          clearInterval(pollInterval);
          // Reset after 3 seconds
          setTimeout(() => setRequestStatus("idle"), 3000);
        }
      } catch (error) {
        console.error("Error polling booking status:", error);
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 5 minutes to prevent infinite loops
    setTimeout(() => {
      clearInterval(pollInterval);
      if (requestStatus === "pending") {
        setRequestStatus("timeout");
        setTimeout(() => setRequestStatus("idle"), 3000);
      }
    }, 300000);
  };

  const handleStartChatRequest = async () => {
    if (!selectedCounselorId) return alert("Please select a counselor.");
    
    const bookingData = {
      counselorId: selectedCounselorId,
      slot: new Date().toISOString(), // Immediate request
      notes: "Student is requesting an immediate chat session."
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const result = await res.json();
      if (result.success) {
        setPendingRequest({ bookingId: result.id, counselorName: counselors.find(c => c.userId === selectedCounselorId)?.name });
        setRequestStatus("pending");
        pollBookingStatus(result.id);
      } else {
        throw new Error(result.error || "Failed to create chat request.");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  
  if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading counselors...</div>;
  }

  const selectedCounselor = counselors.find(c => c.userId === selectedCounselorId);

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-hero dark:gradient-hero-dark p-6">
        {/* Header */}
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
                Confidential Counseling
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Connect with licensed professionals in a safe, encrypted environment. Your privacy is our priority.
            </p>
        </motion.section>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Counselor Selection */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-1 space-y-6">
                 <div className="glass rounded-3xl p-6 shadow-2xl">
                     <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Available Counselors</h3>
                     <div className="space-y-3">
                         {counselors.map((c) => (
                             <div key={c.userId} onClick={() => setSelectedCounselorId(c.userId)} className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedCounselorId === c.userId ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-transparent hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}>
                                 <p className="font-semibold text-gray-800 dark:text-white">{c.name}</p>
                                 <p className="text-sm text-gray-600 dark:text-gray-400">{c.qualification}</p>
                                 <span className={`mt-1 text-xs font-bold ${c.isAvailable ? 'text-green-500' : 'text-gray-400'}`}>{c.isAvailable ? 'Available Now' : 'Away'}</span>
                             </div>
                         ))}
                     </div>
                 </div>
            </motion.div>

            {/* Main Interaction Area */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="lg:col-span-3">
                <AnimatePresence mode="wait">
                    {requestStatus === "idle" && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-3xl shadow-2xl p-8 text-center">
                            <h2 className="text-2xl font-bold mb-2">Ready to Talk?</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">You are about to connect with <strong>{selectedCounselor?.name || 'a counselor'}</strong>.</p>
                            <Button onClick={handleStartChatRequest} size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition">
                                <MessageCircle className="mr-3" /> Start Confidential Chat
                            </Button>
                            <div className="mt-6 flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                                <Shield size={16}/>
                                <span className="text-sm font-medium">End-to-end Encrypted</span>
                            </div>
                        </motion.div>
                    )}
                    {requestStatus === "pending" && (
                         <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-3xl shadow-2xl p-8 text-center">
                            <div className="animate-pulse mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center"><Clock className="w-8 h-8 text-yellow-500"/></div>
                            <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">Request Sent</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Waiting for <strong>{pendingRequest.counselorName}</strong> to accept your chat request...</p>
                         </motion.div>
                    )}
                     {requestStatus === "accepted" && (
                         <motion.div key="accepted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-3xl shadow-2xl p-8 text-center">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-green-500"/></div>
                            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Request Accepted!</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Connecting you to the chat room...</p>
                         </motion.div>
                    )}
                    {requestStatus === "rejected" && (
                         <motion.div key="rejected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-3xl shadow-2xl p-8 text-center">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-400/20 flex items-center justify-center"><AlertCircle className="w-8 h-8 text-red-500"/></div>
                            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Counselor Unavailable</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">The counselor is unable to chat right now. Please try again later or choose another counselor.</p>
                         </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CounselingPage;
