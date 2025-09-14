"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  Shield, 
  Clock, 
  User, 
  Heart,
  Bot,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  Settings,
  Mic,
  MicOff,
  VideoOff,
  MoreHorizontal,
  Smile,
  Paperclip,
  ThumbsUp,
  Zap,
  Award,
  Users,
  BookOpen,
  Activity,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

const Counseling = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Dr. Sarah Chen, your counselor. How are you feeling today? 😊",
      sender: "counselor",
      timestamp: new Date(),
      type: "text",
      status: "delivered"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("active");
  const [selectedCounselor, setSelectedCounselor] = useState(1);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Session timer
    const timer = setInterval(() => {
      if (sessionStatus === "active") {
        setSessionTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStatus]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    // Add a small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      status: "sending"
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);
    setShowQuickActions(false);

    // Update message status
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: "delivered" } : msg
      ));
    }, 1000);

    // Simulate counselor response
    setTimeout(() => {
      const responses = [
        "I understand. Can you tell me more about what's been on your mind lately? 🤔",
        "That sounds challenging. How long have you been feeling this way? 💙",
        "Thank you for sharing that with me. What coping strategies have you tried so far? 🌟",
        "I can hear that this is really affecting you. Let's work through this together. 🤝",
        "That's a very common experience for students. You're not alone in this. 🫂",
        "It takes courage to reach out. I'm here to support you through this. 💪"
      ];
      
      const counselorMessage = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "counselor",
        timestamp: new Date(),
        type: "text",
        status: "delivered"
      };

      setMessages(prev => [...prev, counselorMessage]);
      setIsTyping(false);
    }, 2000 + Math.random() * 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (text) => {
    setNewMessage(text);
    setShowQuickActions(false);
  };

  const counselors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      specialty: "Anxiety & Depression",
      rating: 4.9,
      experience: "8 years",
      status: "online",
      avatar: "👩‍⚕️",
      languages: ["English", "Mandarin"],
      nextAvailable: "Available now"
    },
    {
      id: 2,
      name: "Dr. Marcus Johnson",
      specialty: "Academic Stress & ADHD",
      rating: 4.8,
      experience: "6 years",
      status: "online",
      avatar: "👨‍⚕️",
      languages: ["English", "Spanish"],
      nextAvailable: "Available now"
    },
    {
      id: 3,
      name: "Dr. Elena Rodriguez",
      specialty: "Relationships & Social Issues",
      rating: 4.9,
      experience: "10 years",
      status: "busy",
      avatar: "👩‍⚕️",
      languages: ["English", "Spanish", "Portuguese"],
      nextAvailable: "Available in 15 min"
    },
    {
      id: 4,
      name: "Dr. Aisha Patel",
      specialty: "Trauma & PTSD",
      rating: 4.9,
      experience: "12 years",
      status: "away",
      avatar: "👩‍⚕️",
      languages: ["English", "Hindi", "Gujarati"],
      nextAvailable: "Available in 30 min"
    }
  ];

  const quickActions = [
    { text: "I'm feeling anxious about upcoming exams", icon: Heart, color: "text-red-500" },
    { text: "I need help managing stress", icon: Zap, color: "text-yellow-500" },
    { text: "I'm having relationship issues", icon: Users, color: "text-purple-500" },
    { text: "I feel overwhelmed with everything", icon: AlertCircle, color: "text-orange-500" },
    { text: "I'm struggling with sleep", icon: Clock, color: "text-blue-500" },
    { text: "I need academic support", icon: BookOpen, color: "text-green-500" }
  ];

  const currentCounselor = counselors.find(c => c.id === selectedCounselor);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen gradient-hero dark:gradient-hero-dark flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 dark:text-gray-300 text-lg">Connecting you to a counselor...</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Secure & Anonymous</p>
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
                Anonymous{" "}
                <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  Counseling
                </span>
                <motion.span
                  className="inline-block ml-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  💚
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Connect with licensed mental health professionals in a safe, confidential environment. 
                Your privacy is our priority.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        <div className="px-6 pb-20 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Counselor Selection Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="glass rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 hover-lift">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 soft-blue" />
                  Available Counselors
                </h3>
                <div className="space-y-4">
                  {counselors.map((counselor) => (
                    <motion.div
                      key={counselor.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        counselor.id === selectedCounselor 
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                          : "border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/10"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCounselor(counselor.id)}
                    >
                      <div className="flex items-center mb-3">
                        <div className="text-2xl mr-3">{counselor.avatar}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{counselor.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{counselor.specialty}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          counselor.status === "online" ? "bg-green-500" : 
                          counselor.status === "busy" ? "bg-yellow-500" : "bg-gray-400"
                        }`} />
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {counselor.rating}
                        </div>
                        <span>{counselor.experience}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{counselor.nextAvailable}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800 dark:text-green-200">100% Confidential</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    All conversations are encrypted and completely anonymous. Your identity is protected.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Chat Interface */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="glass rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 h-[700px] flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <motion.div 
                        className="text-3xl mr-3"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {currentCounselor?.avatar}
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">{currentCounselor?.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{currentCounselor?.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Online</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Session: {formatTime(sessionTime)}
                      </div>
                      <Button size="sm" variant="outline" className="glass border-0">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className="max-w-xs lg:max-w-md">
                            <div
                              className={`px-4 py-3 rounded-2xl relative ${
                                message.sender === "user"
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                  : "glass text-gray-800 dark:text-white"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className={`text-xs ${
                                  message.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                                }`}>
                                  {message.timestamp.toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                                {message.sender === "user" && (
                                  <div className="flex items-center">
                                    {message.status === "sending" && (
                                      <Clock className="w-3 h-3 text-blue-200" />
                                    )}
                                    {message.status === "delivered" && (
                                      <CheckCircle className="w-3 h-3 text-blue-200" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="glass text-gray-800 dark:text-white px-4 py-3 rounded-2xl">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">{currentCounselor?.name} is typing...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Quick Actions */}
                <AnimatePresence>
                  {showQuickActions && (
                    <motion.div
                      className="p-4 border-t border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Quick responses:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickActions.map((action, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleQuickAction(action.text)}
                            className="flex items-center px-3 py-2 glass hover:bg-white/20 dark:hover:bg-gray-800/20 text-gray-700 dark:text-gray-200 rounded-lg text-sm transition-all duration-200 hover-scale"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <action.icon className={`w-4 h-4 mr-2 ${action.color}`} />
                            {action.text}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        className="w-full px-4 py-3 glass border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none pr-12 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                        <motion.button 
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Smile className="w-5 h-5" />
                        </motion.button>
                        <motion.button 
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Paperclip className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-interactive"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Session Controls */}
              <motion.div 
                className="mt-6 flex justify-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="glass border-0 hover:bg-green-500/20 text-green-600 dark:text-green-400 px-6 py-3 rounded-xl transition-all duration-300"
                    onClick={() => setIsCallActive(!isCallActive)}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {isCallActive ? "End Call" : "Voice Call"}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="glass border-0 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-6 py-3 rounded-xl transition-all duration-300"
                    onClick={() => setIsCallActive(!isCallActive)}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Video Call
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="glass border-0 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl transition-all duration-300"
                    onClick={() => setSessionStatus("ended")}
                  >
                    End Session
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Emergency Resources */}
        <motion.section 
          className="px-6 pb-20 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="glass rounded-3xl p-8 text-center relative overflow-hidden hover-lift"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-orange-500/10 dark:from-red-400/10 dark:via-pink-400/10 dark:to-orange-400/10"></div>
              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                  Need Immediate Help?
                </h2>
                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                  If you&apos;re experiencing a mental health crisis, please reach out to emergency services immediately.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-interactive"
                    >
                      Call 911
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="glass border-0 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-8 py-4 text-lg rounded-xl transition-all duration-300"
                    >
                      Crisis Text Line: 741741
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </ProtectedRoute>
  );
};

export default Counseling;
