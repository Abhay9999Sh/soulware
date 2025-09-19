"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { MessageSquare, Bell, Calendar, Loader } from 'lucide-react';
import { Button } from "@/components/ui/button"; // Assuming you have this

export default function CounselorDashboard() {
    const { user } = useUser();
    const [bookings, setBookings] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("chats");

    // Fetch all necessary data for the counselor
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Use Promise.all to fetch chats and bookings simultaneously
                const [chatsRes, bookingsRes] = await Promise.all([
                    fetch('/api/chats'),
                    fetch('/api/bookings')
                ]);

                if (!chatsRes.ok) throw new Error('Failed to fetch chats');
                const chatsData = await chatsRes.json();
                setChats(chatsData);

                if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
                const bookingsData = await bookingsRes.json();
                setBookings(bookingsData);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

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

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader className="animate-spin" /> Loading Dashboard...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Counselor Dashboard</h1>
            
            <div className="flex border-b mb-6">
                <button onClick={() => setActiveTab("chats")} className={`flex items-center gap-2 py-3 px-4 font-medium transition ${activeTab === 'chats' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
                    <MessageSquare size={18} /> Student Chats ({chats.length})
                </button>
                <button onClick={() => setActiveTab("requests")} className={`flex items-center gap-2 py-3 px-4 font-medium transition ${activeTab === 'requests' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
                    <Bell size={18} /> Booking Requests ({pendingRequests.length})
                </button>
                 <button onClick={() => setActiveTab("upcoming")} className={`flex items-center gap-2 py-3 px-4 font-medium transition ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
                    <Calendar size={18} /> Upcoming Sessions ({upcomingSessions.length})
                </button>
            </div>

            <div>
                {activeTab === 'chats' && (
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold mb-4">All Conversations</h2>
                        {chats.length > 0 ? chats.map(chat => (
                            <Link href={`/chat/${chat.conversationId}`} key={chat.conversationId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                                    {chat.studentName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-semibold text-gray-800 dark:text-white">{chat.studentName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(chat.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                                </div>
                            </Link>
                        )) : <p className="text-gray-500">No active chats.</p>}
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Pending Booking Requests</h2>
                        {pendingRequests.length > 0 ? pendingRequests.map(booking => (
                            <div key={booking._id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold ...">{booking.studentId?.profile?.displayName || 'Student'}</p>                                        <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(booking.scheduledFor).toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <Button onClick={() => handleStatusUpdate(booking._id, "rejected")} variant="destructive" size="sm">Reject</Button>
                                        <Button onClick={() => handleStatusUpdate(booking._id, "confirmed")} size="sm">Accept</Button>
                                    </div>
                                </div>
                            </div>
                        )) : <p className="text-gray-500">No pending booking requests.</p>}
                    </div>
                )}
                
                {activeTab === 'upcoming' && (
                     <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Confirmed Offline Sessions</h2>
                        {upcomingSessions.length > 0 ? upcomingSessions.map(booking => (
                            <div key={booking._id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg text-gray-800 dark:text-white">{booking.studentId.profile.displayName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(booking.scheduledFor).toLocaleString()}</p>
                                </div>
                                <Button onClick={() => handleStatusUpdate(booking._id, "completed")} variant="outline" size="sm">Mark as Complete</Button>
                            </div>
                        )) : <p className="text-gray-500">No upcoming sessions.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}