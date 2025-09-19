"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  BookOpen,
  Sparkles,
  User as UserIcon,
  Quote,
  MapPin,
  CheckCircle
} from "lucide-react";

// --- A list of motivational quotes ---
const motivationalQuotes = [
  { text: "Your feelings are valid. You have a right to feel whatever you feel.", author: "Unknown" },
  { text: "It's okay to not be okay. It's okay to ask for help.", author: "Unknown" },
  { text: "Healing is not linear. Be patient with your own journey.", author: "Yung Pueblo" },
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "The bravest thing I ever did was continuing my life when I wanted to die.", author: "Juliette Lewis" },
  { text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.", author: "Glenn Close" },
  { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" }
];

export default function StudentDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    if (user) {
      fetchBookings();
      // Select a random quote when the component loads
      setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings`);
      if (response.ok) {
        const data = await response.json();
        // Filter for only offline, upcoming sessions
        const upcomingOfflineBookings = data.filter(b => 
            b.mode === 'offline' && 
            (b.status === 'pending' || b.status === 'confirmed')
        );
        setBookings(Array.isArray(upcomingOfflineBookings) ? upcomingOfflineBookings : []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Sidebar: Profile & Actions */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Student Details Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col items-center text-center"
            >
              {/* Always show a generic avatar for anonymity */}
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center">
                 <UserIcon size={48} className="text-gray-500 dark:text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.fullName || 'Student'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.primaryEmailAddress.emailAddress}</p>
            </motion.div>

            {/* Motivational Quote Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
            >
              <Quote className="w-8 h-8 text-blue-500 mb-3" />
              <p className="text-gray-800 dark:text-gray-200 italic">"{quote.text}"</p>
              <p className="text-right text-gray-500 dark:text-gray-400 font-medium mt-3">- {quote.author}</p>
            </motion.div>

            {/* Action Cards */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <ActionCard 
                icon={MessageCircle} 
                title="Find a Counselor" 
                description="Book a session or start a chat"
                onClick={() => router.push('/counseling')}
                color="blue"
              />
              <ActionCard 
                icon={Sparkles} 
                title="AI Chatbot 'Heath'" 
                description="Get instant AI-powered support"
                onClick={() => router.push('/ai-chat')}
                color="purple"
              />
              <ActionCard 
                icon={BookOpen} 
                title="Go to Library" 
                description="Read articles and resources"
                onClick={() => router.push('/library')}
                color="green"
              />
            </motion.div>
          </aside>

          {/* Right Column: Upcoming Sessions */}
          <main className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Upcoming Sessions</h1>
              
              {bookings.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-500">Book an appointment with a counselor to get started.</p>
                  <Button onClick={() => router.push("/counseling")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    Book Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              )}
            </motion.div>
          </main>

        </div>
      </div>
    </div>
  );
}

// Helper component for action cards
const ActionCard = ({ icon: Icon, title, description, onClick, color }) => {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    green: "bg-green-600 hover:bg-green-700",
  }
  return (
    <button 
      onClick={onClick}
      className={`w-full p-6 rounded-2xl shadow-md text-white text-left flex items-center gap-4 transition ${colors[color]}`}
    >
      <Icon size={32} className="flex-shrink-0 opacity-90" />
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </button>
  )
}

// Helper function and component for displaying a booking
const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return {
          text: "Confirmed",
          color: "text-green-600 bg-green-100 border-green-200",
          icon: <CheckCircle className="w-5 h-5" />
        };
      case "pending":
      default:
        return {
          text: "Pending",
          color: "text-yellow-600 bg-yellow-100 border-yellow-200",
          icon: <Clock className="w-5 h-5" />
        };
    }
};

const BookingCard = ({ booking }) => {
    const statusInfo = getStatusInfo(booking.status);
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
              Session with {booking.counselorId?.profile?.displayName || "Counselor"}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(booking.scheduledFor).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Clock className="w-4 h-4 mr-2" />
              {new Date(booking.scheduledFor).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </div>
            {booking.roomNumber && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="w-4 h-4 mr-2" />
                Room {booking.roomNumber}
              </div>
            )}
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="ml-2">{statusInfo.text}</span>
          </div>
        </div>
      </motion.div>
    );
}