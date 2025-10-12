"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs"; 
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Heart, 
  GraduationCap, 
  Shield, 
  Users, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Loader2
} from "lucide-react";

// Dreamy Color Palette (matching your theme)
const colors = {
  primary: '#6495ED',
  secondary: '#E996AF', 
  tertiary: '#A3A3CC',
  accent: '#E6B38F',
};

function OnboardingComponent() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect'); // Get where user wanted to go
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function checkUser() {
      try {
        // Check if this Clerk user already exists in MongoDB
        const res = await fetch(`/api/users?clerkId=${user.id}`);
        const data = await res.json();

        if (data?.role) {
          // User exists, now check if they've completed the starter quiz
          const quizRes = await fetch('/api/quiz/score');
          const quizData = await quizRes.json();
          
          if (quizData?.score !== null && quizData?.score !== undefined) {
            // User has completed both onboarding and starter quiz
            setIsRedirecting(true);
            setTimeout(() => {
              // If they were trying to access a specific page, redirect there
              if (redirectTo) {
                router.push(redirectTo);
              } else {
                // Otherwise redirect to their role-based dashboard
                if (data.role === "student") router.push("/dashboard/student");
                if (data.role === "counselor") router.push("/dashboard/counselor");
                if (data.role === "volunteer") router.push("/dashboard/volunteer");
                if (data.role === "admin") router.push("/dashboard/admin");
              }
            }, 1500);
          } else {
            // User exists but hasn't taken starter quiz
            // Only redirect students to quiz, others can access their features
            if (data.role === "student") {
              setIsRedirecting(true);
              setTimeout(() => {
                router.push("/quiz/starter");
              }, 1500);
            } else {
              // Non-students can access their requested page
              setIsRedirecting(true);
              setTimeout(() => {
                if (redirectTo) {
                  router.push(redirectTo);
                } else {
                  if (data.role === "counselor") router.push("/dashboard/counselor");
                  if (data.role === "volunteer") router.push("/dashboard/volunteer");
                  if (data.role === "admin") router.push("/dashboard/admin");
                }
              }, 1500);
            }
          }
        } else {
          // New user → show onboarding form
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking user:", err);
        setLoading(false);
      }
    }

    checkUser();
  }, [user, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">
            Checking your account...
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please wait while we set things up for you
          </p>
        </motion.div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting you to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000">
      {/* Background Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl opacity-20"
          style={{ top: '10%', left: '20%' }}
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
          style={{ top: '70%', left: '80%' }}
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
          style={{ top: '50%', left: '10%' }}
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
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="inline-flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <span className="text-4xl font-bold text-gray-800 dark:text-white">
                <span className="text-blue-600 dark:text-blue-400">Soul</span>ware
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
              Welcome to Your{" "}
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                Mental Health Journey
              </span>
            </h1>

            <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Let's get you started with personalized mental health support. 
              Choose your role to access the right resources for your needs.
            </p>
          </motion.div>

          {/* Role Selection */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Student Role Card */}
            <motion.div
              className="mb-8"
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/profile/student">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${colors.primary}20` }}
                      >
                        <GraduationCap className="w-8 h-8" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          I'm a Student
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Access peer support, counseling resources, and mental health tools designed specifically for students.
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-2 transition-all duration-300" />
                  </div>

                  {/* Features */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { icon: Shield, text: "Anonymous Support", color: colors.primary },
                      { icon: Users, text: "Peer Community", color: colors.secondary },
                      { icon: Sparkles, text: "Personalized Resources", color: colors.tertiary }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${feature.color}15` }}
                        >
                          <feature.icon className="w-4 h-4" style={{ color: feature.color }} />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Other Roles Info */}
            <motion.div
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/30 dark:border-gray-600/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Are you a Counselor, Volunteer, or Administrator?
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Professional roles are assigned by system administrators to ensure proper verification and credentials.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    Counselors
                  </span>
                  <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    Peer Supporters
                  </span>
                  <span className="px-4 py-2 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">
                    Administrators
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help with your account?{" "}
                <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Contact Support
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
const OnboardingLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading onboarding...</p>
    </div>
  </div>
);

// Wrapper component with Suspense boundary
export default function Onboarding() {
  return (
    <Suspense fallback={<OnboardingLoading />}>
      <OnboardingComponent />
    </Suspense>
  );
}
