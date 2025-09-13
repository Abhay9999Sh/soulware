"use client";

import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import PHQ9Quiz from "@/components/PHQ9Quiz";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Brain, Target, Sparkles } from "lucide-react";

const StarterQuizPage = () => {
  const { user } = useUser();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = (quizResult) => {
    console.log("Starter quiz completed:", quizResult);
    // Here you would save the quiz result to your database
    // and update the user's progress
    setQuizCompleted(true);
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 3000);
  };

  if (quizCompleted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen gradient-hero dark:gradient-hero-dark flex items-center justify-center">
          <motion.div
            className="text-center max-w-2xl mx-auto p-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <Target className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Welcome to Your Wellness Journey! 🎉
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your starter assessment is complete. We&apos;re now personalizing your dashboard based on your responses.
            </p>
            
            <div className="flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mr-3"></div>
              <span className="text-gray-600 dark:text-gray-300">Redirecting to your personalized dashboard...</span>
            </div>
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
        </div>

        {/* Header */}
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
                Welcome{" "}
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {user?.firstName || "to Soulware"}
                </span>
                <motion.span
                  className="inline-block ml-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🌟
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Let&apos;s start your mental wellness journey with a quick assessment. 
                This will help us personalize your experience and track your progress over time.
              </motion.p>

              <motion.div
                className="flex flex-wrap justify-center gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">Science-Based</span>
                </div>
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">Personalized</span>
                </div>
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">5 Minutes</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Quiz Component */}
        <div className="relative z-10">
          <PHQ9Quiz 
            onComplete={handleQuizComplete}
            isStarterQuiz={true}
            userId={user?.id}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StarterQuizPage;
