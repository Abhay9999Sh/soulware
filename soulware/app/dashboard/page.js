"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  MessageCircle, 
  Users, 
  Bot,
  CheckCircle,
  Clock,
  Star,
  Target,
  BarChart3,
  Zap,
  Award,
  Activity,
  Sparkles,
  ArrowRight,
  Plus,
  Settings,
  Bell,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingChatbot from "@/components/FloatingChatbot";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useUser();
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [hasCompletedStarterQuiz, setHasCompletedStarterQuiz] = useState(false);
  const [userWellnessData, setUserWellnessData] = useState(null);
  const [realTimeStats, setRealTimeStats] = useState({
    moodChecks: 0,
    articlesRead: 0,
    communityPosts: 0,
    sessions: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setProgress(65);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (progress > 0) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getEncouragingMessage = () => {
    const messages = [
      "You're making incredible progress on your wellness journey! ✨",
      "Every small step counts towards your mental health goals. 🌟",
      "Remember to be kind to yourself today. 💙",
      "Your commitment to self-care is truly inspiring. 🌸",
      "Take a moment to appreciate how far you've come. 🎯"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const quickActions = [
    {
      icon: BookOpen,
      title: "Mental Health Library",
      description: "Explore curated resources and articles",
      color: "blue",
      href: "/library",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: MessageCircle,
      title: "Anonymous Counseling",
      description: "Connect with licensed professionals",
      color: "green",
      href: "/counseling",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join peer discussions and groups",
      color: "purple",
      href: "/community",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: Bot,
      title: "AI Companion",
      description: "Get instant support and guidance",
      color: "indigo",
      href: "/chat",
      gradient: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  ];

  const recentActivities = [
    { 
      action: "Completed daily mood check", 
      time: "2 hours ago", 
      icon: CheckCircle, 
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      action: "Read article on stress management", 
      time: "1 day ago", 
      icon: BookOpen, 
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      action: "Joined group discussion on anxiety", 
      time: "2 days ago", 
      icon: Users, 
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    },
    { 
      action: "Scheduled counseling session", 
      time: "3 days ago", 
      icon: Calendar, 
      color: "text-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-900/30"
    }
  ];

  const weeklyStats = [
    { label: "Mood Checks", value: 5, total: 7, color: "blue", percentage: 71 },
    { label: "Articles Read", value: 12, total: 15, color: "green", percentage: 80 },
    { label: "Community Posts", value: 3, total: 5, color: "purple", percentage: 60 },
    { label: "Sessions", value: 1, total: 2, color: "pink", percentage: 50 }
  ];

  const achievements = [
    { title: "7-Day Streak", icon: Award, color: "text-yellow-500" },
    { title: "Community Helper", icon: Heart, color: "text-red-500" },
    { title: "Mindful Reader", icon: BookOpen, color: "text-blue-500" }
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen gradient-hero dark:gradient-hero-dark flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-hero dark:gradient-hero-dark transition-all duration-500">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-xl"
            animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-40 left-1/4 w-40 h-40 bg-green-200/20 dark:bg-green-800/20 rounded-full blur-xl"
            animate={{ y: [0, -25, 0], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Header Section */}
        <motion.div
          className="px-6 py-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="glass rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 hover-lift"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
                <div className="flex-1">
                  <motion.h1 
                    className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {getGreeting()}, {user?.firstName || "there"}! 
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                    >
                      👋
                    </motion.span>
                  </motion.h1>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {getEncouragingMessage()}
                  </motion.p>
                </div>
                
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="text-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Today is</p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {currentTime.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-2xl font-bold soft-blue">
                      {currentTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </motion.div>
                  
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="glass border-0 hover:bg-white/20 dark:hover:bg-gray-800/20"
                      onClick={() => {
                        // Clear notifications when clicked
                        setNotifications(0);
                        // You can add more notification functionality here
                        console.log("Notifications cleared");
                      }}
                    >
                      <Bell className="w-5 h-5" />
                      {notifications > 0 && (
                        <motion.span
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          {notifications}
                        </motion.span>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Progress Tracker */}
              <motion.div
                className="glass-strong rounded-2xl p-6 mb-8 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Target className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Your Wellness Journey</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Keep up the amazing progress!</p>
                      </div>
                    </div>
                    <motion.div
                      className="text-right"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5, type: "spring" }}
                    >
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        {animatedProgress}%
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Complete</p>
                    </motion.div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${animatedProgress}%` }}
                        transition={{ duration: 2, ease: "easeOut", delay: 1.2 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/30 rounded-full"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>Start</span>
                      <span>Goal Achieved!</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                className="flex flex-wrap gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    className="flex items-center gap-2 glass rounded-full px-4 py-2 hover-scale cursor-pointer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 + index * 0.1, type: "spring" }}
                    whileHover={{ y: -2 }}
                  >
                    <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {achievement.title}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Starter Quiz Section - Show if not completed */}
        {!hasCompletedStarterQuiz && (
          <motion.div
            className="px-6 pb-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="glass rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 hover-lift"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0"
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ 
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Target className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <motion.h2 
                      className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      🌟 Start Your Wellness Journey!
                    </motion.h2>
                    <motion.p 
                      className="text-lg text-gray-700 dark:text-gray-200 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Take our quick 5-minute starter assessment to personalize your mental health experience. 
                      Based on the scientifically-validated PHQ-9 questionnaire, this will help us understand 
                      your current wellness state and create a tailored support plan just for you.
                    </motion.p>
                    
                    <motion.div
                      className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Science-Based</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">5 Minutes</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Personalized</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <Link href="/quiz/starter">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-interactive"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Take Starter Quiz
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="px-6 pb-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Sparkles className="w-8 h-8 soft-blue" />
              Quick Actions
              <Sparkles className="w-8 h-8 soft-purple" />
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  onHoverStart={() => setActiveCard(index)}
                  onHoverEnd={() => setActiveCard(null)}
                >
                  <Link href={action.href}>
                    <motion.div
                      className="group cursor-pointer h-full"
                      whileHover={{ y: -12, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className={`glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/20 h-full relative overflow-hidden ${action.bgColor}`}>
                        {/* Animated background gradient */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                          initial={false}
                          animate={{ opacity: activeCard === index ? 0.1 : 0 }}
                        />
                        
                        <div className="relative z-10">
                          <motion.div
                            className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <action.icon className="w-7 h-7 text-white" />
                          </motion.div>
                          
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {action.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                            {action.description}
                          </p>
                          
                          <motion.div
                            className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          >
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats and Recent Activity */}
        <div className="px-6 pb-8 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Weekly Stats */}
            <motion.div
              className="glass rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 hover-lift"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 soft-blue" />
                This Week&apos;s Activity
              </h3>
              <div className="space-y-6">
                {weeklyStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-200 font-medium">{stat.label}</span>
                      <span className="text-gray-800 dark:text-white font-bold">{stat.value}/{stat.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${
                          stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                          stat.color === 'green' ? 'from-green-500 to-green-600' :
                          stat.color === 'purple' ? 'from-purple-500 to-purple-600' :
                          'from-pink-500 to-pink-600'
                        } rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 1 + index * 0.2 }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{stat.percentage}% complete</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Recent Activity */}
            <motion.div
              className="glass rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 hover-lift"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 soft-green" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center p-4 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className={`w-12 h-12 ${activity.bgColor} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-gray-800 dark:text-white font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Motivational Quote */}
        <motion.div
          className="px-6 pb-20 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="glass rounded-3xl p-8 text-center relative overflow-hidden hover-lift"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"></div>
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-12 h-12 mx-auto mb-6 text-yellow-500" />
                </motion.div>
                <blockquote className="text-2xl md:text-3xl font-medium italic mb-6 text-gray-800 dark:text-white">
                  &ldquo;The journey of a thousand miles begins with a single step.&rdquo;
                </blockquote>
                <p className="text-gray-600 dark:text-gray-300 text-lg">- Lao Tzu</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating AI Chatbot */}
        <FloatingChatbot />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
