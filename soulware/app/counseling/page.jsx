"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Calendar, UserCheck, User, Clock, Shield, Star, Heart, Zap, Users, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import StudentQuizCheck from "@/components/StudentQuizCheck";

// Enhanced BookingModal with glassmorphism design
const BookingModal = ({ counselor, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ date: '', time: '', notes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.date || !formData.time) return alert("Please select a date and time.");
        onSubmit(formData);
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4 border border-white/20 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                            className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Calendar className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Session</h2>
                            <p className="text-gray-600 dark:text-gray-300">with {counselor.name}</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Date</label>
                            <input 
                                type="date" 
                                required 
                                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                                className="w-full p-4 glass rounded-2xl border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 transition-all duration-300" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Time</label>
                            <input 
                                type="time" 
                                required 
                                onChange={(e) => setFormData({...formData, time: e.target.value})} 
                                className="w-full p-4 glass rounded-2xl border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 transition-all duration-300" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                            <textarea 
                                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                                className="w-full p-4 glass rounded-2xl border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 transition-all duration-300 resize-none h-24" 
                                placeholder="Anything specific you'd like to discuss?"
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <motion.button
                                type="button"
                                onClick={onClose}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 p-4 glass rounded-2xl border border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 btn-interactive"
                            >
                                Send Request
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const CounselingPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [counselors, setCounselors] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [counselorRatings, setCounselorRatings] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const counselorsRes = await fetch("/api/counselors");
                const counselorsData = await counselorsRes.json();
                if (counselorsRes.ok) {
                    const counselorsList = counselorsData.items || counselorsData || [];
                    setCounselors(counselorsList);
                    
                    // Fetch ratings for each counselor
                    const ratingsPromises = counselorsList.map(async (counselor) => {
                        try {
                            const ratingRes = await fetch(`/api/ratings?counselorId=${counselor.userId}`);
                            if (ratingRes.ok) {
                                const ratingData = await ratingRes.json();
                                return { counselorId: counselor.userId, ...ratingData };
                            }
                        } catch (error) {
                            console.error(`Error fetching rating for counselor ${counselor.userId}:`, error);
                        }
                        return { counselorId: counselor.userId, averageRating: 0, totalRatings: 0 };
                    });
                    
                    const ratingsResults = await Promise.all(ratingsPromises);
                    const ratingsMap = {};
                    ratingsResults.forEach(rating => {
                        ratingsMap[rating.counselorId] = rating;
                    });
                    setCounselorRatings(ratingsMap);
                }

                // This fetches only offline session bookings
                const bookingsRes = await fetch("/api/bookings");
                const bookingsData = await bookingsRes.json();
                if (bookingsRes.ok && Array.isArray(bookingsData)) {
                    const validBookings = bookingsData.filter(b => 
                        b && 
                        b._id && 
                        b.mode === 'offline' && 
                        b.scheduledFor
                    );
                    setMyBookings(validBookings);
                } else {
                    setMyBookings([]);
                }
                
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    // NEW LOGIC for starting a persistent chat
    const handleStartChat = async () => {
        if (!selectedCounselor) return alert("Please select a counselor first.");

        try {
            const res = await fetch("/api/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ counselorUserId: selectedCounselor.userId }),
            });
            
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Failed to start chat.");

            // Show appropriate message based on whether it's a new or existing conversation
            if (result.isNewConversation) {
                console.log("New chat session created with", selectedCounselor.name);
            } else {
                console.log("Continuing existing chat with", selectedCounselor.name);
            }

            // On success, redirect to the chat page with the conversation ID
            router.push(`/chat/${result.conversationId}`);

        } catch (error) {
            alert(error.message);
        }
    };
    
    // Logic for booking offline sessions remains the same
    const handleBookOfflineSession = async (formData) => {
        if (!selectedCounselor) return alert("Please select a counselor.");
        const { date, time, notes } = formData;
        const scheduledFor = new Date(`${date}T${time}`);
        const bookingData = {
            counselorId: selectedCounselor.userId,
            scheduledFor: scheduledFor.toISOString(),
            mode: "offline",
            notes: notes
        };
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });
            const result = await res.json();
            if (res.ok) {
                alert("Booking request sent successfully!");
                setIsBookingModalOpen(false);
                // Refresh the list of bookings
                const bookingsRes = await fetch("/api/bookings");
                const bookingsData = await bookingsRes.json();
                if (bookingsRes.ok && Array.isArray(bookingsData)) {
                    const validBookings = bookingsData.filter(b => 
                        b && 
                        b._id && 
                        b.mode === 'offline' && 
                        b.scheduledFor
                    );
                    setMyBookings(validBookings);
                } else {
                    setMyBookings([]);
                }
            } else {
                throw new Error(result.error || "Failed to send booking request.");
            }
        } catch (error) {
            alert(error.message);
        }
    };
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30';
            case 'confirmed': return 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30';
            case 'completed': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen gradient-hero dark:gradient-hero-dark flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-strong rounded-3xl p-8 text-center shadow-2xl"
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">Connecting you to counselors...</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Secure & Anonymous</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-hero dark:gradient-hero-dark transition-all duration-500">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 right-10 w-32 h-32 bg-green-200/20 dark:bg-green-800/20 rounded-full blur-xl"
                    animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-60 left-20 w-24 h-24 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl"
                    animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div
                    className="absolute bottom-40 right-1/4 w-40 h-40 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-xl"
                    animate={{ y: [0, -25, 0], x: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
            </div>

            {/* Header Section */}
            <motion.section
                className="px-6 py-8 relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.h1
                            className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Anonymous{" "}
                            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                                Counseling
                            </span>
                            <motion.span
                                className="inline-block ml-4"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                💚
                            </motion.span>
                        </motion.h1>
                        <motion.p
                            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            Connect with Counselors in a safe, confidential environment.
                            Your well-being is our priority.
                        </motion.p>
                    </motion.div>
                </div>
            </motion.section>

            <div className="px-6 pb-20 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Counselor Selection */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 hover-lift mb-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <User className="w-6 h-6 text-white" />
                                </motion.div>
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Choose Your Counselor</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {Array.isArray(counselors) && counselors.length > 0 ? counselors.map((c, index) => (
                                    <motion.div
                                        key={c.userId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index, duration: 0.4 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedCounselor(c)}
                                        className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 hover-lift ${
                                            selectedCounselor?.userId === c.userId 
                                                ? 'border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/20' 
                                                : 'border-white/20 hover:border-green-400/50'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <motion.div
                                                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                                                    selectedCounselor?.userId === c.userId 
                                                        ? 'bg-green-500' 
                                                        : 'bg-gradient-to-r from-blue-500 to-green-500'
                                                }`}
                                                animate={{ scale: selectedCounselor?.userId === c.userId ? [1, 1.1, 1] : 1 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                {selectedCounselor?.userId === c.userId ? (
                                                    <User className="w-8 h-8 text-white" />
                                                ) : (
                                                    "👩‍⚕️"
                                                )}
                                            </motion.div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">{c.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{c.qualification}</p>
                                                <div className="flex items-center justify-center mt-2">
                                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {counselorRatings[c.userId]?.averageRating > 0 
                                                            ? counselorRatings[c.userId].averageRating.toFixed(1)
                                                            : 'New'
                                                        }
                                                        {counselorRatings[c.userId]?.totalRatings > 0 && (
                                                            <span className="text-xs ml-1">
                                                                ({counselorRatings[c.userId].totalRatings})
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedCounselor?.userId === c.userId && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                                >
                                                    <UserCheck className="w-4 h-4 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="col-span-full text-center py-12">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass rounded-2xl p-8"
                                        >
                                            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Counselors Available</h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Our counselors are currently unavailable. Please try again later or contact support.
                                            </p>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Selected Counselor Actions */}
                        <AnimatePresence>
                            {selectedCounselor && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, type: "spring", damping: 25 }}
                                    className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20"
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <motion.div
                                            className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <UserCheck className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {selectedCounselor.name} Selected
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">Choose how you'd like to connect</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {/* Chat Now Card */}
                                        <motion.div
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="glass rounded-2xl p-8 text-center cursor-pointer hover-lift border border-white/20 group"
                                            onClick={handleStartChat}
                                        >
                                            <motion.div 
                                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                                animate={{ scale: [1, 1.05, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <MessageCircle className="w-8 h-8 text-white" />
                                            </motion.div>
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chat Now</h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">Continue or start your conversation</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-interactive"
                                            >
                                                Open Chat
                                            </motion.button>
                                        </motion.div>

                                        {/* Book Offline Session Card */}
                                        <motion.div
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="glass rounded-2xl p-8 text-center cursor-pointer hover-lift border border-white/20 group"
                                            onClick={() => setIsBookingModalOpen(true)}
                                        >
                                            <motion.div 
                                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                                animate={{ scale: [1, 1.05, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                            >
                                                <Calendar className="w-8 h-8 text-white" />
                                            </motion.div>
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Book Session</h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">Schedule an offline appointment</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full p-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-interactive"
                                            >
                                                Schedule Appointment
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bookings Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 sticky top-8 hover-lift">
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                >
                                    <Calendar className="w-6 h-6 text-white" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Bookings</h2>
                            </div>
                            
                            <div className="space-y-4">
                                {myBookings.length > 0 ? myBookings.filter(booking => booking && booking._id).map((booking, index) => (
                                    <motion.div
                                        key={booking._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="glass rounded-2xl p-6 border border-white/10 hover-lift"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                                    {booking.counselorId?.profile?.displayName || 'Counselor'}
                                                </h4>
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        {new Date(booking.scheduledFor).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        {new Date(booking.scheduledFor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                                        </motion.div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">No scheduled bookings yet</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-interactive"
                                        >
                                            Book Your First Session
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>

                            {/* Privacy Notice */}
                            <motion.div
                                className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="flex items-center mb-2">
                                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="font-semibold text-green-800 dark:text-green-200">100% Confidential</span>
                                </div>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    All conversations are encrypted and completely secure. Your privacy is protected.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Enhanced Booking Modal */}
            {isBookingModalOpen && selectedCounselor && (
                <BookingModal 
                    counselor={selectedCounselor} 
                    onClose={() => setIsBookingModalOpen(false)} 
                    onSubmit={handleBookOfflineSession} 
                />
            )}
        </div>
    );
};

export default CounselingPage;