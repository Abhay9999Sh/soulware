"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Heart, Shield, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

// Darkened Dreamy Color Palette (matching homepage)
const colors = {
  primary: '#6495ED',
  secondary: '#E996AF', 
  tertiary: '#A3A3CC',
  accent: '#E6B38F',
};

const SignInPage = () => {
  // Use the auth redirect hook to handle full page reloads
  useAuthRedirect();

  return (
    <div className=" min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000">
      {/* Background Animations */}
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
          className="absolute w-32 h-32 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl opacity-20"
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
          className="absolute w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full blur-xl opacity-20"
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
          className="absolute w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl opacity-15"
          style={{ top: '10%', left: '70%' }}
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
          className="absolute w-28 h-28 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl opacity-15"
          style={{ top: '40%', left: '5%' }}
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
        <motion.div
          className="absolute w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full blur-xl opacity-10"
          style={{ top: '70%', left: '90%' }}
          animate={{
            y: [0, -18, 0],
            x: [0, -8, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen py-6 lg:py-8">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            {/* Logo */}
            <Link href="/" className="inline-flex items-center mb-8 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-800 dark:text-white">
                <span className="text-blue-600 dark:text-blue-400">Soul</span>ware
              </span>
            </Link>

            {/* Welcome Message */}
            <h1 className="text-4xl xl:text-5xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
              Welcome Back to Your{" "}
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                Mental Health Journey
              </span>
            </h1>

            <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Continue your path to wellness with our supportive community of students, 
              counselors, and mental health professionals.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: "100% Anonymous & Secure", color: colors.primary },
                { icon: Users, text: "24/7 Peer Support Community", color: colors.secondary },
                { icon: Sparkles, text: "Personalized Mental Health Resources", color: colors.tertiary }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Back to Home */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                href="/"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300"
              >
                ← Back to Homepage
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-800 dark:text-white">
                  <span className="text-blue-600 dark:text-blue-400">Soul</span>ware
                </span>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Sign in to continue your journey
              </p>
            </div>

            {/* Clerk Sign In Component with Custom Styling */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none border-none p-0",
                    headerTitle: "text-2xl font-bold text-gray-800 dark:text-white text-center mb-2",
                    headerSubtitle: "text-gray-600 dark:text-gray-300 text-center mb-6",
                    socialButtonsBlockButton: "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 rounded-xl",
                    socialButtonsBlockButtonText: "font-medium",
                    dividerLine: "bg-gray-300 dark:bg-gray-600",
                    dividerText: "text-gray-500 dark:text-gray-400",
                    formFieldInput: "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300",
                    formFieldLabel: "text-gray-700 dark:text-gray-200 font-medium",
                    formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl",
                    footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300",
                    identityPreviewText: "text-gray-700 dark:text-gray-200",
                    identityPreviewEditButton: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                  },
                  layout: {
                    socialButtonsPlacement: "top",
                    showOptionalFields: false,
                  },
                }}
                routing="hash"
                forceRedirectUrl="/onboarding"
                redirectUrl="/onboarding"
                afterSignInUrl="/onboarding"
                afterSignUpUrl="/onboarding"
              />
            </div>

            {/* Additional Info */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By signing in, you agree to our{" "}
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Terms of Service
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
