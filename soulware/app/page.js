"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useAnimation,
  useInView,
  useAnimationControls,
} from "framer-motion";
import {
  BookOpen,
  Map,
  MessageCircle,
  Users,
  Bot,
  Heart,
  Quote,
  Star,
  Compass,
  Book,
  MessageSquare,
  Users2,
  Sparkles,
  Shield,
  Brain,
  Zap,
  Lock,
  Award,
  TrendingUp,
  Globe,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MessageCircle as Chat,
  Users as Community,
  Clock,
  Globe as World,
  Zap as Lightning,
  Shield as Security,
  Brain as AI,
  Heart as Love,
  Star as Rating,
  Watch,
  PlayIcon,
  BrainIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// --- Darkened Dreamy Video-Inspired Color Palette ---
const colors = {
  // Soft Sky Blues - Matching video's ethereal sky
  primary: "#6495ED", // darker than #87CEEB
  primaryLight: "#91B4C7", // darker than #B0E0E6
  primaryDark: "#355C7D", // darker than #4682B4

  // Cherry Blossom Pinks - Matching the sakura theme
  secondary: "#E996AF", // darker than #FFB6C1
  secondaryLight: "#E6A3B2", // darker than #FFC0CB
  secondaryDark: "#D65B91", // darker than #FF69B4

  // Soft Lavender - Complementing the dreamy atmosphere
  tertiary: "#A3A3CC", // darker than #C8C8E6
  tertiaryLight: "#B0B8D6", // darker than #D6E0F0
  tertiaryDark: "#9B70A0", // darker than #C080C0

  // Warm Peach - Matching sunset tones
  accent: "#ed9252ff", // darker than #FFDAB9
  accentLight: "#E6C7C0", // darker than #FFE4E1
  accentDark: "#D4B87A", // darker than #F5DEB3

  // Ethereal Neutrals
  bgLight: "#D6E0F0", // darker than #F0F8FF
  bgDark: "#B0CDE6", // darker than #E6F3FF
  text: "#2D3748", // keep same, already dark
  textLight: "#4A5568", // darker than #718096
  white: "#F8F8F8", // slightly off-white for contrast
  black: "#1E293B", // darker than #2D3748

  // Dreamy gradient colors matching video
  gradientStart: "#6495ED", // darker than #87CEEB
  gradientMid: "#E996AF", // darker than #FFB6C1
  gradientEnd: "#A3A3CC", // darker than #E6E6FA
};

// Smooth Animation Variants for High Quality - No Delays
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8,
    },
  },
};

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Refs for animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const containerRef = useRef(null);

  // Animation controls
  const heroControls = useAnimation();
  const featuresControls = useAnimation();
  const testimonialsControls = useAnimation();

  // In-view detection
  const heroInView = useInView(heroRef, { threshold: 0.3 });
  const featuresInView = useInView(featuresRef, { threshold: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { threshold: 0.2 });

  // Smooth mouse-following springs for fluid parallax
  const springX = useSpring(mousePosition.x, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  });
  const springY = useSpring(mousePosition.y, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  });

  const { scrollY } = useScroll();
  // Removed heroTransform and heroOpacity to prevent hero section from fading on scroll
  const parallaxY1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const parallaxY2 = useTransform(scrollY, [0, 1000], [0, -400]);

  // Subtle scroll-based transforms for smooth effects
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -50]);

  // Subtle particle transforms for smooth animations
  const subtleParticleX = useTransform(springX, (val) => val * 0.005);
  const subtleParticleY = useTransform(springY, (val) => val * 0.005);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
    };

    const handleScrollEnd = () => {};

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
    };
  }, []);

  // Trigger animations when in view
  useEffect(() => {
    if (heroInView) heroControls.start("show");
    if (featuresInView) featuresControls.start("show");
    if (testimonialsInView) testimonialsControls.start("show");
  }, [
    heroInView,
    featuresInView,
    testimonialsInView,
    heroControls,
    featuresControls,
    testimonialsControls,
  ]);

  // Define all particle transforms individually at the top level (20+ particles)

  const features = [
    {
      icon: Community,
      title: "Peer + Trained Peer Support Community",
      subtitle: "Real-time Connection",
      description:
        "Connect with fellow students and trained peer supporters who understand your journey. Get instant support from a global community that never sleeps.",
      color: colors.primary,
      gradient: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
      delay: 0.1,
      hoverEffect: "rotate",
    },
    {
      icon: Chat,
      title: "The Whispering Booth",
      subtitle: "Anonymous Counseling Session",
      description:
        "A private, secure space to connect with compassionate counselors who listen without judgment. Your privacy is our promise.",
      color: colors.secondary,
      gradient: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryLight})`,
      delay: 0.1,
      hoverEffect: "float",
    },
    {
      icon: Book,
      title: "Engaging Self Directed Learning",
      subtitle: "Wellness Resources",
      description:
        "Access incredible content on key wellbeing topics, guided meditations, journaling tools, and interactive resources designed for student life.",
      color: colors.tertiary,
      gradient: `linear-gradient(135deg, ${colors.tertiary}, ${colors.tertiaryLight})`,
      delay: 0.1,
      hoverEffect: "pulse",
    },
    {
      icon: Clock,
      title: "Access to 24/7 Clinical Helpline",
      subtitle: "Crisis Support",
      description:
        "Round-the-clock access to clinical professionals. Our 24/7 Trust & Safety team monitors conversations and provides immediate crisis intervention.",
      color: colors.accent,
      gradient: `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`,
      delay: 0.1,
      hoverEffect: "glow",
    },
    {
      icon: BrainIcon,
      title: "The Silent Friend",
      subtitle: "AI Chatbot",
      description:
        "Your always-available, AI-powered companion. Chat freely to get instant, empathetic first-aid support and guidance.",
      color: colors.primary,
      gradient: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      delay: 0.1,
      hoverEffect: "neural",
    },
  ];

  const testimonials = [
    {
      quote:
        "Soulware helped me find my voice when I felt completely lost. The community here is incredible, and the counseling felt so safe.",
      author: "Krishna Jain",
      role: "Student",
      rating: 5,
    },
    {
      quote:
        "The anonymous counseling feature gave me the courage to seek help without fear of judgment. It’s a true lifeline.",
      author: "Vansh Ahuja",
      role: "Student",
      rating: 5,
    },
    {
      quote:
        "This platform truly understands what students need. It's been a lifeline during difficult times. The emotional map helped me see my progress.",
      author: "Abhay",
      role: "Student",
      rating: 5,
    },
    {
      quote:
        "The collective voice feature is a game-changer. We finally have a way to raise important issues on campus and see them addressed.",
      author: "Piyush",
      role: "Student",
      rating: 5,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 text-gray-800 dark:text-gray-100 overflow-x-hidden transition-all duration-1000"
    >
      {/* --- Hero Section with Video Background --- */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              minHeight: "100vh",
              minWidth: "100vw",
            }}
            onLoadedData={(e) => {
              // Ensure smooth playback
              e.target.style.opacity = "1";
            }}
            onError={(e) => {
              // Fallback to gradient background if video fails to load
              e.target.style.display = "none";
              e.target.parentElement.style.background =
                "linear-gradient(135deg, #0F172A, #1E293B, #334155)";
            }}
          >
            <source src="/background.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
          </video>
        </div>

        {/* Adaptive Dreamy Overlay for Both Light and Dark Themes */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/20 via-sky-100/30 to-pink-100/20 dark:from-black/40 dark:via-purple-900/50 dark:to-indigo-900/40"></div>

        {/* Subtle floating particles for additional visual interest */}
        <div className="absolute inset-0 z-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-sm opacity-20"
              style={{
                width: 8 + i * 2,
                height: 8 + i * 2,
                backgroundColor: [
                  colors.primary,
                  colors.secondary,
                  colors.tertiary,
                ][i % 3],
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                x: subtleParticleX,
                y: subtleParticleY,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-30 text-center px-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Super Cool Animated Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 dark:border-gray-700/30 mb-8"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Supporting Students Globally
            </span>
          </motion.div>

          {/* Enhanced Headline with TalkCampus-inspired Design */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
          >
            <motion.span
              className="block text-gray-800 dark:text-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              From Overwhelmed Minds
            </motion.span>
            <motion.span
              className="relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                className="text-transparent bg-clip-text font-black"
                style={{
                  backgroundImage: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.tertiary})`,
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                To Empowered Souls
              </motion.span>
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-teal-200/20 rounded-2xl blur-xl"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 dark:text-gray-200 mb-8 max-w-5xl mx-auto leading-relaxed font-light px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            A digital sanctuary for students, blending science, empathy, and
            support to turn everyday struggles into pathways of growth.
          </motion.p>

          {/* Interactive Stats Bar inspired by TalkCampus */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {[
              {
                icon: Community,
                text: "Students Helped",
                color: colors.primary,
              },
              { icon: Clock, text: "24/7 Support", color: colors.secondary },
              { icon: World, text: "23 Languages", color: colors.tertiary },
              { icon: Rating, text: "4.9/5 Rating", color: colors.accent },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 dark:border-gray-700/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {stat.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            <motion.div className="relative group">
              <AuthButton
                isDashboardRoute={true}
                isProtected={true}
                size="lg"
                className="relative text-gray-100 px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-3xl group w-full sm:w-auto"
                style={{
                  background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 2,
                  }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  Log in to your Journey
                  <ArrowRight className="w-5 h-5" />
                </span>
              </AuthButton>
            </motion.div>

            <motion.div className="relative group">
              <Link href="/library">
                <Button
                  variant="outline"
                  size="lg"
                  className="relative px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:scale-105 group w-full sm:w-auto"
                >
                  <span className="flex items-center gap-3 relative z-10">
                    <PlayIcon className="w-5 h-5" />
                    Explore Library
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Indicators with TalkCampus Style */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            <motion.div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 dark:bg-gray-800/10 backdrop-blur-sm border border-white/10 dark:border-gray-700/20">
              <Security className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                Anonymous & Safe
              </span>
            </motion.div>
            <motion.div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 dark:bg-gray-800/10 backdrop-blur-sm border border-white/10 dark:border-gray-700/20">
              <Lightning className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                32s Avg Response
              </span>
            </motion.div>
            <motion.div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 dark:bg-gray-800/10 backdrop-blur-sm border border-white/10 dark:border-gray-700/20">
              <AI className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                AI-Powered Support
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Enhanced Feature Showcase Section --- */}
      <section
        ref={featuresRef}
        className="py-32 px-6 bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden transition-all duration-1000"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, ${colors.secondary}40, transparent)`,
              y: parallaxY1,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-48 h-48 rounded-full blur-3xl opacity-15"
            style={{
              background: `radial-gradient(circle, ${colors.tertiary}40, transparent)`,
              y: parallaxY2,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black dark:text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Unrivalled{" "}
            <motion.span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(45deg, ${colors.tertiary}, ${colors.primary})`,
              }}
            >
              end-to-end support
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-gray-900 dark:text-gray-100 max-w-5xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            The only end-to-end wellbeing support system for students. We
            combine the best peer-to-peer support, real-time crisis escalation,
            Knowledge Hub, clinical helpline and anonymous counseling - all in
            one place.
          </motion.p>
        </div>

        <motion.div
          className="max-w-7xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                }}
                viewport={{ once: true }}
              >
                <div className="relative bg-white dark:bg-gray-800 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl transition-all duration-500 border border-gray-300 dark:border-gray-600 hover:shadow-2xl h-full overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-900">
                  {/* Animated Background Gradient */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: feature.gradient,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Floating Particles for Each Card */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-60"
                        style={{
                          backgroundColor: feature.color,
                          left: `${20 + i * 30}%`,
                          top: `${30 + i * 20}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 0.6, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2 + i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <motion.div
                        className="w-24 h-24 rounded-full flex items-center justify-center relative"
                        style={{
                          background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)`,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon
                          className="w-12 h-12"
                          style={{ color: feature.color }}
                        />
                        {/* Glow Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30"
                          style={{
                            background: `radial-gradient(circle, ${feature.color}60, transparent)`,
                          }}
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                    </div>

                    <h3
                      className="text-2xl font-bold mb-2 text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
                      style={{ color: feature.color }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-lg font-medium text-black dark:text-gray-100 mb-4 group-hover:text-black dark:group-hover:text-black transition-colors duration-300">
                      {feature.subtitle}
                    </p>
                    <p className="text-gray-900 dark:text-gray-200 leading-relaxed group-hover:text-black dark:group-hover:text-black transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Animated Border */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100"
                    style={{
                      borderImage: `linear-gradient(45deg, ${feature.color}, transparent) 1`,
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second row - 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.slice(3, 5).map((feature, index) => (
              <motion.div
                key={index + 3}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.4,
                  delay: (index + 3) * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                }}
                viewport={{ once: true }}
              >
                <div className="relative bg-white dark:bg-gray-800 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl transition-all duration-500 border border-gray-300 dark:border-gray-600 hover:shadow-2xl h-full overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* Animated Background Gradient */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: feature.gradient,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Floating Particles for Each Card */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-60"
                        style={{
                          backgroundColor: feature.color,
                          left: `${20 + i * 30}%`,
                          top: `${30 + i * 20}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 0.6, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2 + i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <motion.div
                        className="w-24 h-24 rounded-full flex items-center justify-center relative"
                        style={{
                          background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)`,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon
                          className="w-12 h-12"
                          style={{ color: feature.color }}
                        />
                        {/* Glow Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30"
                          style={{
                            background: `radial-gradient(circle, ${feature.color}60, transparent)`,
                          }}
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                    </div>

                    <h3
                      className="text-2xl font-bold mb-2 group-hover:text-white dark:text-white transition-colors duration-300"
                      style={{ color: feature.color }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-lg font-medium text-black dark:text-gray-100 mb-4 group-hover:text-black dark:group-hover:text-black transition-colors duration-300">
                      {feature.subtitle}
                    </p>
                    <p className="text-gray-900 dark:text-gray-200 leading-relaxed group-hover:text-black dark:group-hover:text-black transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Animated Border */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100"
                    style={{
                      borderImage: `linear-gradient(45deg, ${feature.color}, transparent) 1`,
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- Mission & Values Section --- */}
      <section className="py-20 px-6 bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Built with <span className="text-tertiary">Empathy</span>. Secured
              with <span className="text-primary">Trust</span>.
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              We believe mental health support should be accessible, empowering,
              and built on a foundation of genuine care.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Heart,
                title: "Empathy First",
                description:
                  "Every interaction is guided by compassion and understanding.",
                color: colors.secondary,
              },
              {
                icon: Shield,
                title: "Confidentiality",
                description:
                  "Your privacy and security are our top priorities. Your data is always safe.",
                color: colors.primary,
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "Connect with thousands of students who understand your journey. You are not alone.",
                color: colors.tertiary,
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={itemVariants}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: `linear-gradient(45deg, ${value.color}1A, ${value.color}33)`,
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                >
                  <value.icon
                    className="w-10 h-10"
                    style={{ color: value.color }}
                  />
                </motion.div>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: value.color }}
                >
                  {value.title}
                </h3>
                <p className="text-gray-800 dark:text-gray-100 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="py-20 px-6 bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              From Our <span className="text-primary">Community</span>
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Stories of healing and hope from students who found their strength
              with us.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-300 dark:border-gray-600"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-lg text-gray-900 dark:text-gray-100 italic leading-relaxed mb-4">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="text-lg font-semibold text-black dark:text-white">
                  {testimonial.author}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {testimonial.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Final Call to Action Section --- */}
      <section className="py-20 px-6 bg-gradient-to-r from-sky-400 via-pink-400 to-purple-400 relative overflow-hidden text-center text-white transition-all duration-1000">
        <motion.div
          className="max-w-6xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experience SoulWare in Action
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
            Discover why SoulWare is the perfect companion for your institution.
            Our mission is to empower students worldwide with smarter, holistic
            support.
          </p>

          <Link href="/about">
            <Button
              size="lg"
              className="relative text-lg px-10 py-5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              style={{ backgroundColor: colors.accent }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Learn More About Us</span>
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
