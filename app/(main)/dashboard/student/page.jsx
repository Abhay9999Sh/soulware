"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
// NEW: Import the chatbot component
import FloatingChatbot from "@/components/FloatingChatbot"; 
import { 
  Calendar, Clock, MessageCircle, BookOpen, Sparkles, User as UserIcon, Quote,
  MapPin, CheckCircle, Star, Heart, Zap, Shield, TrendingUp, Award
} from "lucide-react";

const moodQuotes = {
  "very-happy": [
    { text: "Your radiant energy is a gift to the world. Use this positive momentum to set meaningful goals and spread kindness.", author: "Mental Health Tip" },
    { text: "Celebrate this joy mindfully. Practice gratitude for three specific things that brought you happiness today.", author: "Wellness Guide" },
    { text: "Channel this beautiful energy into creative pursuits or helping others. Joy multiplies when shared.", author: "Positive Psychology" },
    { text: "Your happiness is valid and important. Remember this feeling during challenging times - you have the strength to return here.", author: "Self-Care Reminder" },
    { text: "Use this high-energy moment to build healthy habits. Start that project, call a friend, or try something new.", author: "Growth Mindset" },
    { text: "Document this joy in a journal. These positive memories become anchors during difficult periods.", author: "Therapeutic Practice" },
    { text: "Your enthusiasm can inspire others who are struggling. Be the light that shows others the way forward.", author: "Community Support" },
    { text: "Practice mindful appreciation. Notice the small details that contribute to this wonderful feeling.", author: "Mindfulness Practice" }
  ],
  "happy": [
    { text: "This contentment is your natural state. Build daily practices that nurture and maintain this positive mindset.", author: "Mental Wellness" },
    { text: "Happiness is a skill you can develop. Notice what thoughts and actions led to this feeling and repeat them.", author: "Cognitive Therapy" },
    { text: "Use this stable mood to tackle challenges with confidence. You have the emotional resources to handle difficulties.", author: "Resilience Building" },
    { text: "Share your positive energy with someone who might need it. Connection amplifies happiness and builds community.", author: "Social Support" },
    { text: "This is the perfect time for self-reflection. What values and activities align with your authentic self?", author: "Self-Discovery" },
    { text: "Build on this foundation of contentment. Set small, achievable goals that align with your values.", author: "Goal Setting" },
    { text: "Practice gratitude for this peaceful moment. Acknowledge the progress you've made in your mental health journey.", author: "Gratitude Practice" },
    { text: "Your balanced mood shows your inner strength. Trust in your ability to navigate life's ups and downs.", author: "Self-Confidence" }
  ],
  "sad": [
    { text: "Sadness is not weakness - it's your heart processing important experiences. Allow yourself to feel without judgment.", author: "Emotional Intelligence" },
    { text: "This difficult emotion carries valuable information. What does your sadness need you to understand or change?", author: "Therapeutic Insight" },
    { text: "Reach out to someone you trust. Sharing your burden makes it lighter and strengthens your support network.", author: "Connection Therapy" },
    { text: "Practice the RAIN technique: Recognize, Allow, Investigate with kindness, and Nurture yourself through this feeling.", author: "Mindfulness Therapy" },
    { text: "Your sadness is temporary, but the strength you build by working through it is permanent.", author: "Resilience Training" },
    { text: "Engage in gentle self-care: take a warm bath, listen to soothing music, or spend time in nature.", author: "Self-Care Guide" },
    { text: "Write down your feelings without censoring. Sometimes expressing sadness on paper helps process and release it.", author: "Expressive Therapy" },
    { text: "Remember: seeking professional help is a sign of wisdom and self-respect, not weakness.", author: "Mental Health Advocacy" }
  ],
  "very-sad": [
    { text: "You are experiencing intense pain, and that takes tremendous courage. Please reach out to a mental health professional or crisis helpline.", author: "Crisis Support" },
    { text: "Your life has value and meaning, even when it doesn't feel that way. Call 988 (Suicide & Crisis Lifeline) if you need immediate support.", author: "Crisis Prevention" },
    { text: "This overwhelming sadness is treatable. Depression lies to you - you deserve help, hope, and healing.", author: "Depression Support" },
    { text: "Focus on surviving this moment, then the next hour, then today. Small steps forward are still progress.", author: "Crisis Coping" },
    { text: "You are not a burden. The people who care about you want to help. Let them be there for you.", author: "Support Network" },
    { text: "Professional therapy and medication can provide relief. Your brain chemistry can be balanced and healed.", author: "Treatment Hope" },
    { text: "This intense pain is not permanent. With proper support and treatment, you can feel better. Please don't give up.", author: "Recovery Promise" },
    { text: "Create a safety plan: identify warning signs, coping strategies, and people to contact. You deserve to live and thrive.", author: "Safety Planning" },
    { text: "Your mental health matters. Contact a counselor, therapist, or your doctor. Healing is possible with professional support.", author: "Professional Help" },
    { text: "You've survived difficult times before. With the right help and support, you can overcome this too. Please reach out today.", author: "Hope & Healing" }
  ]
};

const moodOptions = [
  { id: "very-happy", label: "Very Happy", emoji: "😄", color: "from-yellow-400 to-orange-400" },
  { id: "happy", label: "Happy", emoji: "😊", color: "from-green-400 to-blue-400" },
  { id: "sad", label: "Sad", emoji: "😔", color: "from-blue-400 to-purple-400" },
  { id: "very-sad", label: "Very Sad", emoji: "😢", color: "from-purple-400 to-pink-400" }
];

export default function StudentDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [selectedMood, setSelectedMood] = useState(null);
  const [wellnessScore, setWellnessScore] = useState(0);
  // State to control the chatbot is kept here
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchWellnessScore();
      // Set default quote from happy mood
      const defaultQuotes = moodQuotes.happy;
      setQuote(defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)]);
    }
  }, [user]);

  const fetchWellnessScore = async () => {
    try {
      // Fetch quiz score from database - only from starter quiz
      const response = await fetch('/api/quiz/score', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Use quiz score if available
        if (data.score !== undefined && data.score !== null) {
          setWellnessScore(data.score);
          return;
        }
      }

      // Default score if no quiz taken yet
      setWellnessScore(0);

    } catch (error) {
      console.error("Error fetching quiz score:", error);
      setWellnessScore(0);
    }
  };

  const handleMoodSelection = (moodId) => {
    setSelectedMood(moodId);
    const selectedQuotes = moodQuotes[moodId];
    const randomQuote = selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
    setQuote(randomQuote);
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings`);
      if (response.ok) {
        const data = await response.json();
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
      <div className="h-[calc(100vh-4rem)] gradient-hero dark:gradient-hero-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-12 text-center shadow-2xl border border-white/20"
        >
          <motion.div
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-700 dark:text-gray-300 font-medium text-xl mb-2">Loading Dashboard...</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Preparing your personalized experience</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] gradient-hero dark:gradient-hero-dark transition-all duration-500 overflow-hidden">
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
      
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-full mx-auto p-4 sm:p-6">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back!</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Your mental wellness journey continues here</p>
              </div>
              <motion.div 
                className="flex items-center gap-4 mt-4 lg:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified Student</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

          {/* Profile Card - Compact */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 glass-strong rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col items-center text-center h-fit"
          >
            <motion.div 
              className="relative mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-500 p-1">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  <UserIcon size={32} className="text-gray-600 dark:text-gray-300" />
                </div>
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{user?.fullName || 'Student'}</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{user?.primaryEmailAddress.emailAddress}</p>
            </motion.div>
          </motion.div>

          {/* Quick Stats Row */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-strong rounded-2xl p-3 shadow-xl border border-white/20 h-auto"
            >
              <div className="text-center mb-2">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Upcoming Sessions</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Scheduled appointments</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bookings.length}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-3 shadow-xl border border-white/20 h-auto"
            >
              <div className="text-center mb-2">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Wellness Score</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{wellnessScore === 0 ? 'Take starter quiz' : 'From starter quiz'}</p>
              </div>
              <div className="text-center">
                <motion.span 
                  className="text-2xl font-bold text-green-600 dark:text-green-400"
                  key={wellnessScore}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {wellnessScore === 0 ? '--' : `${wellnessScore}%`}
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-strong rounded-2xl p-3 shadow-xl border border-white/20 h-auto"
            >
              <div className="text-center mb-2">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Today's Mood</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">How are you feeling?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                {moodOptions.map((mood) => (
                  <motion.button
                    key={mood.id}
                    onClick={() => handleMoodSelection(mood.id)}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                      selectedMood === mood.id
                        ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-sm">{mood.emoji}</span>
                      <span className="text-xs leading-tight">{mood.label.split(' ')[0]}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Action Cards Row */}
          <div className="lg:col-span-6 grid grid-cols-1 gap-4">
            <ActionCard 
              icon={MessageCircle} 
              title="Find a Counselor" 
              description="Book a session or start a chat"
              onClick={() => router.push('/counseling')}
              color="blue"
            />
            <ActionCard 
              icon={Sparkles} 
              title="Your AI Help" 
              description="Get instant AI-powered support"
              onClick={() => setIsChatbotOpen(true)}
              color="purple"
            />
            <ActionCard 
              icon={BookOpen} 
              title="Go to Library" 
              description="Read articles and resources"
              onClick={() => router.push('/library')}
              color="green"
            />
          </div>

          {/* Quote Card */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-strong rounded-3xl p-6 shadow-2xl border border-white/20 h-full flex flex-col justify-center relative overflow-hidden"
            >
              {/* Mood-based background gradient */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 bg-gradient-to-br ${moodOptions.find(m => m.id === selectedMood)?.color || 'from-gray-400 to-gray-600'}`}
                />
              )}
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Quote className="w-8 h-8 text-purple-500" />
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Mental Health Tip</span>
                  </div>
                  
                  {selectedMood && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm"
                    >
                      <span className="text-lg">{moodOptions.find(m => m.id === selectedMood)?.emoji}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {moodOptions.find(m => m.id === selectedMood)?.label}
                      </span>
                    </motion.div>
                  )}
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quote.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.p 
                      className="text-gray-800 dark:text-gray-200 text-base leading-relaxed mb-4 font-medium"
                    >
                      "{quote.text}"
                    </motion.p>
                    <motion.p 
                      className="text-right text-gray-600 dark:text-gray-400 font-semibold text-sm"
                    >
                      - {quote.author}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
                
                {!selectedMood && (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4 opacity-70">
                    <p>Select your mood above to get personalized mental health guidance ✨</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sessions Section */}
          <div className="lg:col-span-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass-strong rounded-3xl p-6 shadow-2xl border border-white/20"
            >
              <motion.h2 
                className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Calendar className="w-6 h-6 text-blue-500" />
                Your Upcoming Sessions
              </motion.h2>
              
              {bookings.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-6"
                  >
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">No upcoming sessions</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">Book an appointment with a counselor to get started.</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={() => router.push("/counseling")} 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Book Now
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {bookings.map((booking, index) => (
                      <motion.div
                        key={booking._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <BookingCard booking={booking} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          </div>
        </div>
      </div>
      
      {/* The chatbot component is now rendered here from its own file */}
      <FloatingChatbot isOpen={isChatbotOpen} setIsOpen={setIsChatbotOpen} />
    </div>
  );
}

// --- Helper Components ---

const ActionCard = ({ icon: Icon, title, description, onClick, color }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
  };
  
  return (
    <motion.button 
      onClick={onClick}
      className={`w-full glass-strong rounded-2xl shadow-xl border border-white/20 text-white text-left overflow-hidden relative group h-20`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${colors[color]} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative z-10 p-4 flex items-center gap-3 h-full">
        <motion.div
          className="flex-shrink-0"
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={24} className="opacity-90" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm mb-1 truncate">{title}</h3>
          <p className="text-xs opacity-90 truncate">{description}</p>
        </div>
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap className="w-4 h-4 opacity-70" />
        </motion.div>
      </div>
    </motion.button>
  );
};

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.3 }}
        className="glass-strong rounded-2xl shadow-xl border border-white/20 p-4 group"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <motion.h3 
              className="font-bold text-gray-800 dark:text-white text-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Session with {booking.counselorId?.profile?.displayName || "Counselor"}
            </motion.h3>
            
            <motion.div 
              className={`flex items-center px-3 py-1 rounded-xl border font-medium text-sm ${statusInfo.color}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {statusInfo.icon}
              </motion.div>
              <span className="ml-1">{statusInfo.text}</span>
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <motion.div 
              className="flex items-center text-gray-600 dark:text-gray-300 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">
                {new Date(booking.scheduledFor).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-gray-600 dark:text-gray-300 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2">
                <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">
                {new Date(booking.scheduledFor).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
            
            {booking.roomNumber && (
              <motion.div 
                className="flex items-center text-gray-600 dark:text-gray-300 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                  <MapPin className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">Room {booking.roomNumber}</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
};