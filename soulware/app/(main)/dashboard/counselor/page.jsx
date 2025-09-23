"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bell, Calendar, Loader, Users, Clock, CheckCircle, XCircle, Star, TrendingUp, Heart, Award, User, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CounselorDashboard() {
    const { user } = useUser();
    const [bookings, setBookings] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("chats");
    const [userRole, setUserRole] = useState(null);
    const [roleError, setRoleError] = useState(null);
    const [ratings, setRatings] = useState(null);
    const [ratingsLoading, setRatingsLoading] = useState(false);

    // Fetch user role and verify counselor access
    useEffect(() => {
        const fetchUserRole = async () => {
            if (!user) return;
            try {
                const userRes = await fetch('/api/users/me');
                const userData = await userRes.json();

                console.log("👤 User role check:", userData);

                if (userData.role !== 'counselor') {
                    setRoleError(`Access denied. Expected counselor role, but got: ${userData.role}`);
                    return;
                }

                setUserRole(userData.role);
            } catch (error) {
                console.error("❌ Error fetching user role:", error);
                setRoleError("Failed to verify user role");
            }
        };
        fetchUserRole();
    }, [user]);

    // Fetch all necessary data for the counselor
    useEffect(() => {
        const fetchData = async () => {
            if (!user || userRole !== 'counselor') return;
            try {
                console.log("📊 Fetching counselor dashboard data...");
                // Use Promise.all to fetch chats and bookings simultaneously
                const [chatsRes, bookingsRes] = await Promise.all([
                    fetch('/api/chats'),
                    fetch('/api/bookings')
                ]);

                if (!chatsRes.ok) throw new Error('Failed to fetch chats');
                const chatsData = await chatsRes.json();
                setChats(chatsData);
                console.log("💬 Chats loaded:", chatsData.length);

                if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
                const bookingsData = await bookingsRes.json();
                setBookings(bookingsData);
                console.log("📅 Bookings loaded:", bookingsData.length);

            } catch (error) {
                console.error("❌ Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, userRole]);

    // Fetch counselor ratings
    const fetchRatings = async () => {
        if (!user || userRole !== 'counselor') return;
        setRatingsLoading(true);
        try {
            // Get current user's ID from the database
            const userRes = await fetch('/api/users/me');
            const userData = await userRes.json();

            const ratingsRes = await fetch(`/api/ratings?counselorId=${userData._id}`);
            if (ratingsRes.ok) {
                const ratingsData = await ratingsRes.json();
                setRatings(ratingsData);
                console.log("⭐ Ratings loaded:", ratingsData);
            }
        } catch (error) {
            console.error("❌ Error fetching ratings:", error);
        } finally {
            setRatingsLoading(false);
        }
    };

    // Fetch ratings when user role is confirmed
    useEffect(() => {
        fetchRatings();
    }, [user, userRole]);

    // Handle accepting/rejecting offline booking requests
    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const res = await fetch("/api/bookings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, status: newStatus }),
            });
            if (res.ok) {
                // Refresh data after update
                const updatedBookings = await (await fetch('/api/bookings')).json();
                setBookings(updatedBookings);
            } else {
                const result = await res.json();
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };

    const pendingRequests = bookings.filter((b) => b.status === "pending" && b.mode === "offline");
    const upcomingSessions = bookings.filter((b) => b.status === "confirmed" && b.mode === "offline");

    // Show role error if access is denied
    if (roleError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-red-900 dark:to-orange-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-strong rounded-3xl p-8 shadow-2xl border border-red-200/50 dark:border-red-700/20 text-center max-w-md"
                >
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Access Denied</h2>
                    <p className="text-red-600 dark:text-red-300 mb-4">{roleError}</p>
                    <Link href="/" className="inline-block">
                        <Button className="bg-red-600 hover:bg-red-700 text-white">
                            Go to Home
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 text-center"
                >
                    <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Your Dashboard...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Verifying counselor access...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-1000">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-2">
                                    Counselor Dashboard
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Welcome back, {user?.firstName || 'Counselor'}! 👋
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="glass rounded-2xl p-4 text-center"
                                >
                                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{chats.length}</p>
                                    <p className="text-xs text-gray-500">Active Chats</p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="glass rounded-2xl p-4 text-center"
                                >
                                    <Calendar className="w-6 h-6 text-green-600 mx-auto mb-1" />
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{upcomingSessions.length}</p>
                                    <p className="text-xs text-gray-500">Sessions</p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="glass rounded-2xl p-4 text-center"
                                >
                                    <Bell className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{pendingRequests.length}</p>
                                    <p className="text-xs text-gray-500">Requests</p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="glass rounded-2xl p-4 text-center"
                                >
                                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                        {ratings?.averageRating > 0 ? ratings.averageRating.toFixed(1) : 'New'}
                                    </p>
                                    <p className="text-xs text-gray-500">Rating</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="glass-strong rounded-2xl p-2 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8"
                >
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: "chats", icon: MessageCircle, label: "Student Chats", count: chats.length, color: "blue" },
                            { id: "requests", icon: Bell, label: "Booking Requests", count: pendingRequests.length, color: "orange" },
                            { id: "upcoming", icon: Calendar, label: "Upcoming Sessions", count: upcomingSessions.length, color: "green" },
                            { id: "ratings", icon: Star, label: "My Ratings", count: ratings?.totalRatings || 0, color: "purple" }
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${activeTab === tab.id
                                        ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }`}>
                                    {tab.count}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Content Sections */}
                <AnimatePresence mode="wait">
                    {activeTab === 'chats' && (
                        <motion.div
                            key="chats"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="glass-strong rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                    <MessageCircle className="w-6 h-6 text-blue-600" />
                                    Active Conversations
                                </h2>
                                {chats.length > 0 ? (
                                    <div className="space-y-3">
                                        {chats.map((chat, index) => (
                                            <motion.div
                                                key={chat.conversationId}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Link href={`/chat/${chat.conversationId}`} className="block">
                                                    <div className="glass rounded-xl p-4 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                                                {chat.studentName?.charAt(0) || 'S'}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <p className="font-bold text-gray-800 dark:text-white">{chat.studentName || 'Student'}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                                                        {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </p>
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No active conversations yet</p>
                                        <p className="text-gray-400 text-sm">Students will appear here when they start chatting</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'requests' && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="glass-strong rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                    <Bell className="w-6 h-6 text-orange-600" />
                                    Pending Booking Requests
                                </h2>
                                {pendingRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {pendingRequests.map((booking, index) => (
                                            <motion.div
                                                key={booking._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                                            {booking.studentId?.profile?.displayName?.charAt(0) || 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-lg text-gray-800 dark:text-white">
                                                                {booking.studentId?.profile?.displayName || 'Student'}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                                <Clock className="w-4 h-4" />
                                                                {new Date(booking.scheduledFor).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button
                                                                onClick={() => handleStatusUpdate(booking._id, "rejected")}
                                                                variant="destructive"
                                                                size="sm"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                Reject
                                                            </Button>
                                                        </motion.div>
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button
                                                                onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                                                                size="sm"
                                                                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Accept
                                                            </Button>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No pending requests</p>
                                        <p className="text-gray-400 text-sm">New booking requests will appear here</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'upcoming' && (
                        <motion.div
                            key="upcoming"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="glass-strong rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                    Upcoming Sessions
                                </h2>
                                {upcomingSessions.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingSessions.map((booking, index) => (
                                            <motion.div
                                                key={booking._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                                            {booking.studentId?.profile?.displayName?.charAt(0) || 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-lg text-gray-800 dark:text-white">
                                                                {booking.studentId?.profile?.displayName || 'Student'}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                                <Clock className="w-4 h-4" />
                                                                {new Date(booking.scheduledFor).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            onClick={() => handleStatusUpdate(booking._id, "completed")}
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Mark Complete
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No upcoming sessions</p>
                                        <p className="text-gray-400 text-sm">Confirmed sessions will appear here</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'ratings' && (
                        <motion.div
                            key="ratings"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Rating Overview */}
                            <div className="glass-strong rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                    <Star className="w-6 h-6 text-yellow-500" />
                                    My Ratings & Reviews
                                </h2>

                                {ratingsLoading ? (
                                    <div className="text-center py-8">
                                        <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-yellow-500" />
                                        <p className="text-gray-500">Loading your ratings...</p>
                                    </div>
                                ) : ratings ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {/* Average Rating */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="glass rounded-xl p-6 text-center"
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Star className="w-8 h-8 text-white fill-white" />
                                            </div>
                                            <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                                                {ratings.averageRating > 0 ? ratings.averageRating.toFixed(1) : 'New'}
                                            </p>
                                            <p className="text-sm text-gray-500">Average Rating</p>
                                        </motion.div>

                                        {/* Total Reviews */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="glass rounded-xl p-6 text-center"
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Users className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                                                {ratings.totalRatings}
                                            </p>
                                            <p className="text-sm text-gray-500">Total Reviews</p>
                                        </motion.div>

                                        {/* Performance */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="glass rounded-xl p-6 text-center"
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <TrendingUp className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                                                {ratings.averageRating >= 4.5 ? 'Excellent' :
                                                    ratings.averageRating >= 4.0 ? 'Great' :
                                                        ratings.averageRating >= 3.5 ? 'Good' :
                                                            ratings.averageRating > 0 ? 'Fair' : 'New'}
                                            </p>
                                            <p className="text-sm text-gray-500">Performance</p>
                                        </motion.div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No ratings yet</p>
                                        <p className="text-gray-400 text-sm">Complete some sessions to receive ratings</p>
                                    </div>
                                )}

                                {/* Recent Reviews */}
                                {ratings?.ratings && ratings.ratings.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-pink-500" />
                                            Recent Reviews
                                        </h3>
                                        <div className="space-y-4">
                                            {ratings.ratings.slice(0, 5).map((review, index) => (
                                                <motion.div
                                                    key={review._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="glass rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                                                            {review.studentId?.profile?.displayName?.charAt(0) || 'S'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="flex">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            className={`w-4 h-4 ${star <= review.rating
                                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                                    : 'text-gray-300'
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm text-gray-500">
                                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            {review.feedback && (
                                                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                                    "{review.feedback}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}