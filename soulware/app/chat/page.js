"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  ThumbsDown,
  TrendingUp,
  Users,
  AlertTriangle,
  Filter,
  Hash,
  Clock,
  Heart,
  Zap,
  BookOpen,
  Home,
  UserCheck,
  Flag,
  Plus,
  Search,
  ArrowUp,
  Crown,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/contexts/ThemeContext";

const AnonymousChat = () => {
  const { user } = useUser();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "The exam stress is getting overwhelming. Anyone else feeling like they can't keep up with all the assignments?",
      timestamp: new Date(Date.now() - 3600000),
      category: "academic",
      upvotes: 23,
      downvotes: 2,
      replies: 8,
      isDaily: false,
      userId: "anon_001",
      hasVoted: false,
      voteType: null
    },
    {
      id: 2,
      content: "I feel so isolated in my dorm. It's hard to make friends when everyone seems to already have their groups.",
      timestamp: new Date(Date.now() - 7200000),
      category: "social",
      upvotes: 31,
      downvotes: 1,
      replies: 12,
      isDaily: true,
      userId: "anon_002",
      hasVoted: false,
      voteType: null
    },
    {
      id: 3,
      content: "The dining hall food quality has really gone downhill this semester. We're paying so much for meal plans.",
      timestamp: new Date(Date.now() - 10800000),
      category: "campus",
      upvotes: 45,
      downvotes: 8,
      replies: 15,
      isDaily: false,
      userId: "anon_003",
      hasVoted: false,
      voteType: null
    },
    {
      id: 4,
      content: "Anxiety about job interviews is keeping me up at night. The career center appointments are always booked.",
      timestamp: new Date(Date.now() - 14400000),
      category: "mental-health",
      upvotes: 18,
      downvotes: 0,
      replies: 6,
      isDaily: false,
      userId: "anon_004",
      hasVoted: false,
      voteType: null
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [newMessageCategory, setNewMessageCategory] = useState("academic");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const categories = [
    { id: "all", label: "All Topics", icon: Hash, color: "text-gray-600", count: messages.length },
    { id: "academic", label: "Academic Stress", icon: BookOpen, color: "text-blue-600", count: messages.filter(m => m.category === "academic").length },
    { id: "social", label: "Social Issues", icon: Users, color: "text-purple-600", count: messages.filter(m => m.category === "social").length },
    { id: "mental-health", label: "Mental Health", icon: Heart, color: "text-red-600", count: messages.filter(m => m.category === "mental-health").length },
    { id: "campus", label: "Campus Life", icon: Home, color: "text-green-600", count: messages.filter(m => m.category === "campus").length },
    { id: "relationships", label: "Relationships", icon: UserCheck, color: "text-pink-600", count: messages.filter(m => m.category === "relationships").length }
  ];

  const sortOptions = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "recent", label: "Most Recent", icon: Clock },
    { id: "popular", label: "Most Popular", icon: Flame }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVote = (messageId, voteType) => {
    setMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId) {
          let newUpvotes = message.upvotes;
          let newDownvotes = message.downvotes;
          let newHasVoted = true;
          let newVoteType = voteType;

          // If user already voted, remove previous vote
          if (message.hasVoted) {
            if (message.voteType === "up") {
              newUpvotes -= 1;
            } else {
              newDownvotes -= 1;
            }
          }

          // If clicking same vote type, remove vote
          if (message.hasVoted && message.voteType === voteType) {
            newHasVoted = false;
            newVoteType = null;
          } else {
            // Add new vote
            if (voteType === "up") {
              newUpvotes += 1;
            } else {
              newDownvotes += 1;
            }
          }

          return {
            ...message,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            hasVoted: newHasVoted,
            voteType: newVoteType
          };
        }
        return message;
      })
    );
  };

  const handleSubmitMessage = () => {
    if (newMessage.trim() === "") return;

    setIsLoading(true);
    
    const message = {
      id: messages.length + 1,
      content: newMessage,
      timestamp: new Date(),
      category: newMessageCategory,
      upvotes: 0,
      downvotes: 0,
      replies: 0,
      isDaily: false,
      userId: `anon_${Math.random().toString(36).substr(2, 9)}`,
      hasVoted: false,
      voteType: null
    };

    setTimeout(() => {
      setMessages(prev => [message, ...prev]);
      setNewMessage("");
      setShowNewMessageForm(false);
      setIsLoading(false);
    }, 1000);
  };

  const getFilteredMessages = () => {
    let filtered = messages;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(message => message.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort messages
    switch (sortBy) {
      case "recent":
        filtered = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case "popular":
        filtered = filtered.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "trending":
      default:
        filtered = filtered.sort((a, b) => {
          const aScore = a.upvotes - a.downvotes + a.replies;
          const bScore = b.upvotes - b.downvotes + b.replies;
          return bScore - aScore;
        });
        break;
    }

    return filtered;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : Hash;
  };

  const getCategoryColor = (category) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.color : "text-gray-600";
  };

  const dailyProblem = messages.find(m => m.isDaily);

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-hero dark:gradient-hero-dark transition-all duration-500">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-xl"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl"
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
                Anonymous{" "}
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Community
                </span>
                <motion.span
                  className="inline-block ml-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  💬
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Share your thoughts, support others, and help shape campus life. 
                Your voice matters - completely anonymous, always supportive.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* Daily Problem Highlight */}
        {dailyProblem && (
          <motion.section
            className="px-6 pb-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="glass rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Crown className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                      🔥 Today&apos;s Most Supported Issue
                      <span className="ml-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                        {dailyProblem.upvotes} votes
                      </span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 mb-3">
                      {dailyProblem.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {dailyProblem.upvotes} students support this
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {dailyProblem.replies} responses
                      </span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        Escalated to Administration
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Main Content */}
        <div className="px-6 pb-20 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-6">
                {/* New Message Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setShowNewMessageForm(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Share Your Voice
                  </Button>
                </motion.div>

                {/* Categories */}
                <div className="glass rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2 soft-blue" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                          selectedCategory === category.id
                            ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-2 border-transparent"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <category.icon className={`w-4 h-4 mr-3 ${category.color}`} />
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {category.label}
                          </span>
                        </div>
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="glass rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 soft-green" />
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                          sortBy === option.id
                            ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-2 border-transparent"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <option.icon className="w-4 h-4 mr-3 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {option.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Messages Feed */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 glass border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-6">
                <AnimatePresence>
                  {getFilteredMessages().map((message, index) => (
                    <motion.div
                      key={message.id}
                      className="glass rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 hover-lift"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center space-y-2">
                          <motion.button
                            onClick={() => handleVote(message.id, "up")}
                            className={`p-2 rounded-full transition-all duration-300 ${
                              message.voteType === "up"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/20"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </motion.button>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {message.upvotes - message.downvotes}
                          </span>
                          <motion.button
                            onClick={() => handleVote(message.id, "down")}
                            className={`p-2 rounded-full transition-all duration-300 ${
                              message.voteType === "down"
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            {(() => {
                              const CategoryIcon = getCategoryIcon(message.category);
                              return <CategoryIcon className={`w-4 h-4 ${getCategoryColor(message.category)}`} />;
                            })()}
                            <span className={`text-sm font-medium ${getCategoryColor(message.category)}`}>
                              {categories.find(cat => cat.id === message.category)?.label}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(message.timestamp)}
                            </span>
                            {message.isDaily && (
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                                Daily Issue
                              </span>
                            )}
                          </div>

                          <p className="text-gray-800 dark:text-white text-lg leading-relaxed mb-4">
                            {message.content}
                          </p>

                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                            <button className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {message.replies} replies
                            </button>
                            <button className="flex items-center hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300">
                              <Flag className="w-4 h-4 mr-1" />
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div ref={messagesEndRef} />
            </motion.div>
          </div>
        </div>

        {/* New Message Modal */}
        <AnimatePresence>
          {showNewMessageForm && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNewMessageForm(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    Share Your Voice Anonymously
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Category
                    </label>
                    <select
                      value={newMessageCategory}
                      onChange={(e) => setNewMessageCategory(e.target.value)}
                      className="w-full p-3 glass border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 dark:text-white"
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share what's on your mind... Remember, this is completely anonymous."
                      rows={6}
                      className="w-full p-4 glass border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Your message will be posted anonymously. Be respectful and supportive.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowNewMessageForm(false)}
                      variant="outline"
                      className="flex-1 glass border-0 hover:bg-white/20 dark:hover:bg-gray-800/20 py-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitMessage}
                      disabled={!newMessage.trim() || isLoading}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post Anonymously
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
};

export default AnonymousChat;
