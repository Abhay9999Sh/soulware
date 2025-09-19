"use client";

import { motion } from "framer-motion";
import { MessageCircle, Calendar, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

// The BookingModal component for offline sessions remains unchanged.
const BookingModal = ({ counselor, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ date: '', time: '', notes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.date || !formData.time) return alert("Please select a date and time.");
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4"
            >
                <h2 className="text-2xl font-bold mb-4">Book Session with {counselor.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Date</label>
                        <input type="date" required onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Time</label>
                        <input type="time" required onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Notes (Optional)</label>
                        <textarea onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="Anything specific you'd like to discuss?"></textarea>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button type="button" onClick={onClose} variant="outline" className="w-full">Cancel</Button>
                        <Button type="submit" className="w-full">Send Request</Button>
                    </div>
                </form>
            </motion.div>
        </div>
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const counselorsRes = await fetch("/api/counselors");
                const counselorsData = await counselorsRes.json();
                if (counselorsRes.ok) setCounselors(counselorsData);

                // This fetches only offline session bookings
                const bookingsRes = await fetch("/api/bookings");
                const bookingsData = await bookingsRes.json();
                if (bookingsRes.ok) setMyBookings(bookingsData.filter(b => b.mode === 'offline'));
                
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

            // On success, redirect to the chat page with the permanent conversation ID
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
                if (bookingsRes.ok) setMyBookings(bookingsData.filter(b => b.mode === 'offline'));
            } else {
                throw new Error(result.error || "Failed to send booking request.");
            }
        } catch (error) {
            alert(error.message);
        }
    };
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Choose a Counselor</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {counselors.map((c) => (
                                <div key={c.userId} onClick={() => setSelectedCounselor(c)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedCounselor?.userId === c.userId ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'}`}>
                                    <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{c.qualification}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedCounselor && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-8">
                            <div className="flex items-center mb-4">
                                <UserCheck className="w-6 h-6 text-blue-500 mr-3" />
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">You have selected {selectedCounselor.name}</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="border dark:border-gray-700 rounded-xl p-6 flex flex-col items-center text-center">
                                    <MessageCircle className="w-12 h-12 text-blue-500 mb-3" />
                                    <h3 className="text-xl font-semibold mb-2">Chat Now</h3>
                                    <Button onClick={handleStartChat} className="w-full">
                                        Start Conversation
                                    </Button>
                                </div>
                                <div className="border dark:border-gray-700 rounded-xl p-6 flex flex-col items-center text-center">
                                    <Calendar className="w-12 h-12 text-green-500 mb-3" />
                                    <h3 className="text-xl font-semibold mb-2">Book Offline Session</h3>
                                    <Button onClick={() => setIsBookingModalOpen(true)} variant="secondary" className="w-full">Schedule Appointment</Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your Bookings</h2>
                        <div className="space-y-4">
                            {myBookings.length > 0 ? myBookings.map(booking => (
                                <div key={booking._id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{booking.counselorId.profile.displayName}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(booking.scheduledFor).toLocaleString()}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(booking.status)}`}>{booking.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500 dark:text-gray-400">You have no scheduled bookings.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {isBookingModalOpen && selectedCounselor && (
                <BookingModal counselor={selectedCounselor} onClose={() => setIsBookingModalOpen(false)} onSubmit={handleBookOfflineSession} />
            )}
        </div>
    );
};

export default CounselingPage;