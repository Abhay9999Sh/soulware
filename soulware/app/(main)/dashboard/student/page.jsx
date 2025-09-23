"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import StudentQuizCheck from "@/components/StudentQuizCheck";
import WellnessDashboard from "@/components/WellnessDashboard";
import FeedbackModal from "@/components/FeedbackModal";
// NEW: Import the chatbot component
// import FloatingChatbot from "@/components/FloatingChatbot"; 
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  BookOpen, 
  Sparkles, 
  Quote, 
  BarChart3, 
  Heart, 
  User as UserIcon, 
  TrendingUp, 
  TrendingDown, 
  Award,
  MapPin, 
  CheckCircle, 
  Star, 
  Zap, 
  Shield,
  Activity,
  Gamepad2
} from "lucide-react";

// Comprehensive wellness quotes based on mood + wellness score combination
const getWellnessQuotes = (mood, wellnessScore) => {
  const quotes = {
    // High Wellness (75-100%) - Excellent mental health
    high: {
      "very-happy": [
        { text: "You're thriving! Your excellent mental health combined with this joy creates the perfect foundation for achieving your dreams.", author: "Peak Wellness" },
        { text: "This is what optimal mental health looks like. Use this energy to inspire others and create positive change in your community.", author: "Mental Health Excellence" },
        { text: "Your high wellness score reflects your commitment to self-care. Keep nurturing the habits that brought you here.", author: "Wellness Achievement" },
        { text: "You've mastered the art of mental wellness. Consider mentoring others who are still on their journey to better mental health.", author: "Wellness Leadership" }
      ],
      "happy": [
        { text: "Your strong mental health foundation makes this contentment even more meaningful. You've built something sustainable.", author: "Stable Wellness" },
        { text: "This balanced happiness paired with excellent wellness shows you've found your rhythm. Trust this peaceful strength.", author: "Balanced Excellence" },
        { text: "Your high wellness score indicates you've developed excellent coping strategies. This happiness is well-earned.", author: "Earned Contentment" },
        { text: "You're in an excellent mental health space. Use this stability to set meaningful long-term goals.", author: "Optimal Foundation" }
      ],
      "sad": [
        { text: "You're incredibly strong for acknowledging your feelings. Your excellent wellness foundation shows you'll bounce back even stronger.", author: "Strength Recognition" },
        { text: "This moment of sadness is temporary, but your resilience is permanent. You've overcome challenges before and you will again.", author: "Resilience Reminder" },
        { text: "Your high wellness score proves you have amazing inner strength. Trust yourself - you're more capable than you realize.", author: "Inner Strength" },
        { text: "Even the strongest people have difficult moments. Your wellness journey has prepared you to handle this with grace.", author: "Graceful Handling" }
      ],
      "very-sad": [
        { text: "Your high wellness score shows you've built strong mental health habits. Even in deep sadness, you have tools to recover.", author: "Crisis with Foundation" },
        { text: "This intense sadness is concerning, but your excellent wellness foundation means you know how to seek help when needed.", author: "Supported Crisis" },
        { text: "Your mental health journey has given you strength. Use your support systems and professional resources during this difficult time.", author: "Resourceful Recovery" }
      ]
    },
    
    // Good Wellness (50-74%) - Good mental health with room for growth
    good: {
      "very-happy": [
        { text: "This joy is beautiful! Your good wellness foundation can help you sustain and build on this positive energy.", author: "Growing Joy" },
        { text: "Your mental health is in a good place, and this happiness shows you're moving in the right direction. Keep going!", author: "Positive Momentum" },
        { text: "This excitement paired with your solid wellness foundation suggests you're ready for new challenges and growth.", author: "Ready for Growth" },
        { text: "Your good mental health score reflects your efforts. This joy is a reward for the work you've been doing on yourself.", author: "Wellness Reward" }
      ],
      "happy": [
        { text: "This contentment aligns perfectly with your good wellness score. You're building sustainable mental health habits.", author: "Sustainable Happiness" },
        { text: "Your balanced mood and good wellness foundation show you're on the right track. Keep nurturing what's working.", author: "Right Direction" },
        { text: "This peaceful happiness reflects your growing mental health strength. You're creating positive patterns.", author: "Growing Strength" },
        { text: "Your good wellness score and current contentment suggest you're finding your balance. Trust this process.", author: "Finding Balance" }
      ],
      "sad": [
        { text: "You're doing amazing work on your wellness journey! This feeling is just a small bump on your path to greatness.", author: "Journey Progress" },
        { text: "Your good wellness score shows you're already winning the battle. This sadness is temporary - your strength is permanent.", author: "Winning Battle" },
        { text: "Look how far you've come! Your wellness foundation proves you have what it takes to overcome any challenge.", author: "Progress Recognition" },
        { text: "You're building something incredible - a resilient, healthy mindset. This moment doesn't define your amazing journey.", author: "Building Resilience" }
      ],
      "very-sad": [
        { text: "This deep sadness is concerning. Your good wellness foundation means you know when to reach out for additional support.", author: "Seeking Support" },
        { text: "Your mental health journey has taught you valuable lessons. Use them now to navigate this difficult period.", author: "Applied Learning" },
        { text: "Even with good overall wellness, intense sadness needs attention. Your self-awareness is a strength - use it.", author: "Self-Aware Action" }
      ]
    },
    
    // Moderate Wellness (25-49%) - Struggling but not in crisis
    moderate: {
      "very-happy": [
        { text: "This joy is precious when you're working through mental health challenges. Let it remind you that better days are possible.", author: "Hope Spark" },
        { text: "Your happiness today shows that even while building wellness, moments of joy can break through. Hold onto this feeling.", author: "Breakthrough Moment" },
        { text: "This excitement is a sign your mental health efforts are working. Small improvements can lead to big changes.", author: "Progress Indicator" },
        { text: "Your wellness score shows you're in a challenging phase, but this joy proves you're not stuck. Keep moving forward.", author: "Forward Motion" }
      ],
      "happy": [
        { text: "This contentment is meaningful given your current wellness journey. It shows you're making progress, even if slowly.", author: "Meaningful Progress" },
        { text: "Your moderate wellness score doesn't define you. This happiness shows there's more growth and healing ahead.", author: "Future Growth" },
        { text: "Even while working on mental health challenges, you can find moments of peace. This is evidence of your resilience.", author: "Resilience Evidence" },
        { text: "This balanced mood suggests your wellness efforts are starting to pay off. Keep investing in your mental health.", author: "Investment Returns" }
      ],
      "sad": [
        { text: "You're a warrior fighting for your happiness, and warriors have tough days. But you're still fighting - that makes you incredible!", author: "Warrior Spirit" },
        { text: "Every step you take toward wellness matters, even the difficult ones. You're braver than you believe and stronger than you feel.", author: "Brave Steps" },
        { text: "Your journey to better mental health has already started, and that's amazing! This sadness is just one chapter, not your whole story.", author: "Chapter Not Story" },
        { text: "You're not just surviving - you're actively working toward thriving. That determination will carry you through this moment.", author: "Thriving Determination" }
      ],
      "very-sad": [
        { text: "This intense sadness combined with your wellness challenges is serious. Please reach out to a mental health professional today.", author: "Urgent Care" },
        { text: "Your mental health needs more support right now. This deep sadness is a signal to seek additional help immediately.", author: "Help Signal" },
        { text: "You're struggling, and that's okay to acknowledge. But please don't struggle alone - professional support can make a real difference.", author: "Professional Support" },
        { text: "This level of sadness with your current wellness challenges requires immediate attention. You deserve support and care.", author: "Deserve Support" }
      ]
    },
    
    // Low Wellness (0-24%) - Crisis level, needs immediate attention
    low: {
      "very-happy": [
        { text: "This joy is remarkable given your mental health challenges. Please share this moment with a counselor who can help you build on it.", author: "Remarkable Moment" },
        { text: "Your happiness today is important, but your low wellness score suggests you need professional support to sustain positive feelings.", author: "Professional Guidance" },
        { text: "This excitement is a gift, but your overall mental health needs immediate attention. Please reach out for help today.", author: "Immediate Attention" }
      ],
      "happy": [
        { text: "This contentment is precious, but your low wellness score indicates you need more support. Please consider counseling or therapy.", author: "Need Support" },
        { text: "Your peaceful moment is valuable, but your mental health challenges require professional care. You deserve comprehensive help.", author: "Comprehensive Care" },
        { text: "This happiness shows your potential for healing, but your wellness score suggests you need immediate professional support.", author: "Healing Potential" }
      ],
      "sad": [
        { text: "You're incredibly brave for still being here and fighting. Please reach out for the support you deserve - there are people who want to help you shine again.", author: "Brave Fighter" },
        { text: "Your life has immense value, even when it doesn't feel that way. Please call 988 - there are caring people ready to help you find your way back to hope.", author: "Immense Value" },
        { text: "You've survived 100% of your difficult days so far - you're stronger than you know. Please reach out for professional support to help you through this.", author: "Survivor Strength" }
      ],
      "very-sad": [
        { text: "This is a mental health emergency. Please call 988 immediately or go to your nearest emergency room. You are not alone.", author: "Emergency Care" },
        { text: "Your intense sadness and low wellness score indicate immediate danger. Please reach out to emergency services or a crisis hotline now.", author: "Immediate Danger" },
        { text: "This level of distress requires immediate professional intervention. Call 988, go to an ER, or contact emergency services right now.", author: "Emergency Intervention" },
        { text: "You are in crisis and need immediate help. Please don't wait - call 988 or emergency services. Your life has value and meaning.", author: "Life Value" }
      ]
    }
  };

  // Determine wellness category
  let category = 'moderate';
  if (wellnessScore >= 75) category = 'high';
  else if (wellnessScore >= 50) category = 'good';
  else if (wellnessScore >= 25) category = 'moderate';
  else category = 'low';

  return quotes[category][mood] || quotes.moderate.happy;
};

const moodOptions = [
  { id: "very-happy", label: "Exicted", emoji: "😄", color: "from-yellow-400 to-orange-400" },
  { id: "happy", label: "Happy", emoji: "😊", color: "from-green-400 to-blue-400" },
  { id: "sad", label: "Glum", emoji: "😔", color: "from-blue-400 to-purple-400" },
  { id: "very-sad", label: "Sad", emoji: "😢", color: "from-purple-400 to-pink-400" }
];

export default function StudentDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [wellnessScore, setWellnessScore] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [mood, setMood] = useState('happy');
  const [currentQuote, setCurrentQuote] = useState(null);
  const [showDetailedDashboard, setShowDetailedDashboard] = useState(false);
  const [hasComprehensiveData, setHasComprehensiveData] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [loading, setLoading] = useState(true);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentSessionForFeedback, setCurrentSessionForFeedback] = useState(null);
  // State to control the chatbot is kept here
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to open Chatbase bot
  const openChatbaseBot = () => {
    // Try multiple methods to open the Chatbase bot
    try {
      // Method 1: Try to click the Chatbase bubble button (most reliable)
      const chatbaseButton = document.querySelector('#chatbase-bubble-button') || 
                            document.querySelector('[id*="chatbase-bubble"]') ||
                            document.querySelector('.chatbase-bubble') ||
                            document.querySelector('[class*="chatbase"]');
      
      if (chatbaseButton && chatbaseButton.click) {
        console.log('Opening Chatbase via button click');
        chatbaseButton.click();
        return;
      }

      // Method 2: Try to find and click any Chatbase iframe or widget
      const chatbaseIframe = document.querySelector('iframe[src*="chatbase"]');
      if (chatbaseIframe && chatbaseIframe.parentElement) {
        const parentButton = chatbaseIframe.parentElement.querySelector('button');
        if (parentButton) {
          console.log('Opening Chatbase via iframe parent button');
          parentButton.click();
          return;
        }
      }

      // Method 3: Try to call Chatbase API if available
      if (window.chatbase && typeof window.chatbase === 'function') {
        console.log('Opening Chatbase via API');
        window.chatbase('open');
        return;
      }

      // Method 4: Try alternative Chatbase methods
      if (window.chatbase) {
        try {
          window.chatbase('show');
          return;
        } catch (e) {
          console.log('Chatbase show method failed, trying toggle');
          window.chatbase('toggle');
          return;
        }
      }

      // Method 5: Try to dispatch a custom event to trigger Chatbase
      const chatbaseEvent = new CustomEvent('chatbase-open', { bubbles: true });
      document.dispatchEvent(chatbaseEvent);

      // Show user-friendly message
      setTimeout(() => {
        const stillNoChatbase = !document.querySelector('#chatbase-bubble-button') && 
                               !document.querySelector('iframe[src*="chatbase"]');
        
        if (stillNoChatbase) {
          alert('🤖 AI Assistant is loading... Please look for the chat bubble on the page or try again in a moment!');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error opening Chatbase bot:', error);
      // Show a helpful message instead of fallback
      alert('🤖 AI Assistant is loading... Please look for the chat bubble icon on the page!');
    }
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        try {
          await Promise.all([
            fetchBookings(),
            fetchWellnessScore()
          ]);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Set default quote when wellness score is loaded
  useEffect(() => {
    if (wellnessScore !== null && !selectedMood) {
      // Set default quote based on wellness score and happy mood
      const defaultQuotes = getWellnessQuotes('happy', wellnessScore);
      setQuote(defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)]);
    }
  }, [wellnessScore, selectedMood]);

  // Refresh wellness score when user returns to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('Page became visible, refreshing wellness score');
        fetchWellnessScore();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const fetchWellnessScore = async () => {
    try {
      // Fetch quiz score from database - includes comprehensive data
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
          console.log('✅ Wellness score updated:', data.score + '%');
          setWellnessScore(data.score);
          
          // Check if we have comprehensive assessment data
          if (data.domainScores && Object.keys(data.domainScores).length > 1) {
            console.log('📊 Comprehensive assessment data available');
            setHasComprehensiveData(true);
          } else {
            console.log('📋 Basic assessment data only');
            setHasComprehensiveData(false);
          }
          return;
        } else {
          console.log('ℹ️ No quiz taken yet');
          setWellnessScore(null);
          setHasComprehensiveData(false);
          return;
        }
      } else {
        const errorData = await response.text();
        console.error('❌ Failed to fetch quiz score:', response.status, errorData);
        
        if (response.status === 401) {
          console.log('🔐 User not authenticated');
          setWellnessScore(null);
          setHasComprehensiveData(false);
          return;
        }
      }

      // Default to null if API call fails
      setWellnessScore(null);
      setHasComprehensiveData(false);

    } catch (error) {
      console.error("💥 Error fetching quiz score:", error);
      setWellnessScore(null);
      setHasComprehensiveData(false);
    }
  };

  // Function to get wellness score styling based on score ranges
  const getWellnessScoreStyle = (score) => {
    if (score === null) return {
      color: 'text-gray-400 dark:text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      icon: TrendingUp,
      iconColor: 'text-gray-600 dark:text-gray-400'
    };
    
    if (score >= 75) return {
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      icon: TrendingUp,
      iconColor: 'text-green-600 dark:text-green-400'
    };
    else if (score >= 50) return {
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      icon: TrendingUp,
      iconColor: 'text-blue-600 dark:text-blue-400'
    };
    else if (score >= 25) return {
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      icon: TrendingDown,
      iconColor: 'text-orange-600 dark:text-orange-400'
    };
    else return {
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      icon: TrendingDown,
      iconColor: 'text-red-600 dark:text-red-400'
    };
  };

  const handleMoodSelection = (moodId) => {
    setSelectedMood(moodId);
    
    // Get quotes based on both mood and wellness score
    const wellnessQuotes = getWellnessQuotes(moodId, wellnessScore);
    const randomQuote = wellnessQuotes[Math.floor(Math.random() * wellnessQuotes.length)];
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
        
        // Check for completed sessions that need feedback
        const completedBookings = data.filter(b => 
            b.mode === 'offline' && 
            b.status === 'completed'
        );
        setCompletedSessions(completedBookings);
        
        // Check if there's a recently completed session that needs feedback
        const recentlyCompleted = completedBookings.find(b => {
          const completedTime = new Date(b.updatedAt || b.createdAt);
          const now = new Date();
          const timeDiff = now - completedTime;
          // Show feedback modal for sessions completed in the last 5 minutes
          return timeDiff < 5 * 60 * 1000 && !b.hasRating;
        });
        
        if (recentlyCompleted && !showFeedbackModal) {
          setCurrentSessionForFeedback(recentlyCompleted);
          setShowFeedbackModal(true);
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      console.log('Submitting feedback:', feedbackData);
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        console.log('Feedback submitted successfully');
        // Refresh bookings to update the hasRating flag
        await fetchBookings();
      } else {
        const error = await response.json();
        console.error('API Error:', error);
        throw new Error(error.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-12 text-center shadow-2xl border border-gray-200/50 dark:border-gray-600/50"
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-800 dark:text-gray-200 font-medium text-xl mb-2">Loading Dashboard...</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Preparing your personalized experience</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <StudentQuizCheck>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000 overflow-hidden">
      {/* Dreamy Background Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl opacity-20"
          style={{ top: '20%', left: '10%' }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-28 h-28 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl opacity-15"
          style={{ top: '60%', left: '80%' }}
          animate={{
            y: [0, -25, 0],
            x: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full blur-xl opacity-10"
          style={{ top: '80%', left: '30%' }}
          animate={{
            y: [0, -20, 0],
            x: [0, 25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl opacity-15"
          style={{ top: '40%', left: '5%' }}
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-36 h-36 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl opacity-10"
          style={{ top: '10%', left: '70%' }}
          animate={{
            y: [0, -35, 0],
            x: [0, 15, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
                
                <motion.button
                  onClick={() => router.push('/quiz/starter')}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Retake your wellness assessment"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Take Quiz Again</span>
                </motion.button>
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
            className="lg:col-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-600/50 flex flex-col items-center text-center h-fit"
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
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-gray-200/50 dark:border-gray-600/50 h-auto"
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
              className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-gray-200/50 dark:border-gray-600/50 h-auto ${wellnessScore === null ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-300' : ''}`}
              onClick={wellnessScore === null ? () => router.push('/quiz/starter') : undefined}
              whileHover={wellnessScore === null ? { scale: 1.02 } : {}}
            >
              <div className="text-center mb-2">
                <div className="flex items-center justify-center mb-1">
                  <div className={`w-6 h-6 rounded-full ${getWellnessScoreStyle(wellnessScore).bgColor} flex items-center justify-center`}>
                    {React.createElement(getWellnessScoreStyle(wellnessScore).icon, {
                      className: `w-3 h-3 ${getWellnessScoreStyle(wellnessScore).iconColor}`
                    })}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Wellness Score</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {wellnessScore === null ? 'Take starter quiz' : 'From starter quiz'}
                </p>
              </div>
              <div className="text-center">
                <motion.span 
                  className={`text-2xl font-bold ${getWellnessScoreStyle(wellnessScore).color}`}
                  key={wellnessScore}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {wellnessScore === null ? '--' : `${wellnessScore}%`}
                </motion.span>
                {hasComprehensiveData && (
                  <div className="mt-3">
                    <motion.button
                      onClick={() => setShowDetailedDashboard(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 mx-auto transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Details
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-gray-200/50 dark:border-gray-600/50 h-auto"
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

          {/* Action Cards - 2x2 Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionCard 
              icon={MessageCircle} 
              title="Find a Counselor" 
              description="Book a session or start a chat"
              onClick={() => router.push('/counseling')}
              color="blue"
            />
            <ActionCard 
              icon={Sparkles} 
              title="Your AI Carebot" 
              description="Chat with your AI wellness companion"
              onClick={openChatbaseBot}
              color="purple"
            />
            <ActionCard 
              icon={BookOpen} 
              title="Go to Library" 
              description="Read articles and resources"
              onClick={() => router.push('/library')}
              color="green"
            />
            <ActionCard 
              icon={Gamepad2} 
              title="Games & Exercises" 
              description="Interactive wellness activities"
              onClick={() => router.push('/games')}
              color="orange"
            />
          </div>

          {/* Quote Card */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-600/50 h-full flex flex-col justify-center relative overflow-hidden"
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
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-600/50"
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
      
      {/* The chatbot component is now rendered here from its own file
      <FloatingChatbot isOpen={isChatbotOpen} setIsOpen={setIsChatbotOpen} /> */}
      </div>
      
      {/* Comprehensive Wellness Dashboard Modal */}
      <AnimatePresence>
        {showDetailedDashboard && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailedDashboard(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Comprehensive Wellness Dashboard
                </h2>
                <button
                  onClick={() => setShowDetailedDashboard(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <WellnessDashboard />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        appointment={currentSessionForFeedback}
        onSubmit={handleFeedbackSubmit}
      />
    </StudentQuizCheck>
  );
}

// --- Helper Components ---

const ActionCard = ({ icon: Icon, title, description, onClick, color }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
  };
  
  return (
    <motion.button 
      onClick={onClick}
      className={`w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-600/50 text-white text-left overflow-hidden relative group h-24`}
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
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-600/50 p-4 group"
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