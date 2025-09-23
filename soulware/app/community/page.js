"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  TrendingUp,
  Users,
  Filter,
  Hash,
  Clock,
  Heart,
  BookOpen,
  Home,
  UserCheck,
  Flag,
  Plus,
  Search,
  ArrowUp,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/contexts/ThemeContext";

const AnonymousChat = () => {
  const { user } = useUser();
  const { isDark } = useTheme();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [newMessageCategory, setNewMessageCategory] = useState("academic");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // --- NEW STATE FOR COMMENTS ---
  const [activePostId, setActivePostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const categories = [
    { id: "all", label: "All Topics", icon: Hash, color: "text-gray-600" },
    { id: "academic", label: "Academic Stress", icon: BookOpen, color: "text-blue-600" },
    { id: "social", label: "Social Issues", icon: Users, color: "text-purple-600" },
    { id: "mental-health", label: "Mental Health", icon: Heart, color: "text-red-600" },
    { id: "campus", label: "Campus Life", icon: Home, color: "text-green-600" },
    { id: "relationships", label: "Relationships", icon: UserCheck, color: "text-pink-600" },
  ];

  const sortOptions = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "recent", label: "Most Recent", icon: Clock },
    { id: "popular", label: "Most Popular", icon: Flame },
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/community/posts");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
    setIsLoading(false);
  };

  const handleUpvote = async (postId) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/community/posts/${postId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) throw new Error("Upvote failed");
      const updatedPost = await res.json();
      setMessages(prev => prev.map(p => (p._id === updatedPost._id ? { ...updatedPost, isUpvoted: !p.isUpvoted } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async (postId) => {
    if (!user) return;
    const reason = prompt("Please provide a reason for reporting this post:");
    if (reason && reason.trim()) {
      const payload = { reporterId: user.id, targetType: "post", targetId: postId, reason: reason.trim() };
      try {
        const res = await fetch("/api/community/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to submit report");
        alert("Report submitted successfully. Thank you.");
      } catch (err) {
        console.error(err);
        alert("There was an error submitting your report.");
      }
    }
  };

  const handleSubmitMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setIsLoading(true);
    const payload = {
      userId: user.id,
      title: newMessage.substring(0, 50) + (newMessage.length > 50 ? "..." : ""),
      body: newMessage,
      tags: [newMessageCategory],
    };
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const savedMessage = await res.json();
      setMessages(prev => [savedMessage, ...prev]);
      setNewMessage("");
      setShowNewMessageForm(false);
    } catch (err) {
      console.error("Failed to post message:", err);
    }
    setIsLoading(false);
  };
  
  // --- NEW FUNCTIONS FOR COMMENTS ---
  const handleToggleComments = async (postId) => {
    if (activePostId === postId) {
      setActivePostId(null);
      setComments([]);
    } else {
      setActivePostId(postId);
      setIsCommentsLoading(true);
      try {
        const res = await fetch(`/api/community/posts/${postId}/comments`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
      setIsCommentsLoading(false);
    }
  };

  const handleSubmitComment = async (postId) => {
    if (!newComment.trim() || !user) return;
    const payload = { clerkId: user.id, body: newComment };
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const savedComment = await res.json();
      setComments(prev => [...prev, savedComment]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const getFilteredMessages = () => {
    let filtered = messages;
    if (selectedCategory !== "all") filtered = filtered.filter(m => m.tags?.includes(selectedCategory));
    if (searchTerm) filtered = filtered.filter(m => m.body?.toLowerCase().includes(searchTerm.toLowerCase()) || m.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    switch (sortBy) {
      case "recent":
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "popular":
      case "trending":
      default:
        return filtered.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
    }
  };

  const formatTimeAgo = timestamp => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  };

  const getCategoryIcon = category => categories.find(c => c.id === category)?.icon || Hash;
  const getCategoryColor = category => categories.find(c => c.id === category)?.color || "text-gray-600";

  return (
      <ProtectedRoute>
      <div className="min-h-screen gradient-hero dark:gradient-hero-dark transition-all duration-500">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-xl" animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl" animate={{ y: [0, 20, 0], x: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        </div>

        <motion.section className="px-6 py-8 relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
              Anonymous <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Community</span>
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}> 💬</motion.span>
            </motion.h1>
            <motion.p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Share your thoughts, support others, and help shape campus life. Your voice matters - completely anonymous, always supportive.
            </motion.p>
          </div>
        </motion.section>

        <div className="px-6 pb-20 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="space-y-6">
                <Button onClick={() => setShowNewMessageForm(true)} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 text-lg rounded-xl shadow-lg hover:shadow-xl">
                  <Plus className="w-5 h-5 mr-2" /> Share Your Voice
                </Button>
                <div className="glass rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center"><Filter className="w-5 h-5 mr-2 soft-blue" /> Categories</h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full flex items-center justify-between p-3 rounded-xl ${selectedCategory === cat.id ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500" : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-2 border-transparent"}`}>
                        <div className="flex items-center">
                          <cat.icon className={`w-4 h-4 mr-3 ${cat.color}`} />
                          <span className="text-gray-700 dark:text-gray-200 font-medium">{cat.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 soft-green" /> Sort By</h3>
                  <div className="space-y-2">
                    {sortOptions.map(option => (
                      <button key={option.id} onClick={() => setSortBy(option.id)} className={`w-full flex items-center p-3 rounded-xl ${sortBy === option.id ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500" : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-2 border-transparent"}`}>
                        <option.icon className="w-4 h-4 mr-3 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search messages..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 glass border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
              </div>
              <div className="space-y-6">
                <AnimatePresence>
                  {getFilteredMessages().map((message, index) => (
                    <motion.div key={message._id} className="glass rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 hover-lift" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center space-y-2">
                           {/* --- UPDATED UPVOTE BUTTON --- */}
                          <button onClick={() => handleUpvote(message._id)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                            <ArrowUp className={`w-4 h-4 transition-colors ${message.isUpvoted ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'}`} />
                          </button>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{message.upvotes?.length || 0}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            {(() => { const category = message.tags?.[0] || 'general'; const CategoryIcon = getCategoryIcon(category); return <CategoryIcon className={`w-4 h-4 ${getCategoryColor(category)}`} />; })()}
                            <span className={`text-sm font-medium ${getCategoryColor(message.tags?.[0])}`}>{categories.find(c => c.id === message.tags?.[0])?.label || 'General'}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{formatTimeAgo(message.createdAt)}</span>
                          </div>
                          <h3 className="text-md font-bold text-gray-800 dark:text-white mb-2">{message.title}</h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{message.body}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                             {/* --- UPDATED COMMENT BUTTON --- */}
                            <button onClick={() => handleToggleComments(message._id)} className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                              <MessageCircle className="w-4 h-4 mr-1" /> Comments
                            </button>
                            <button onClick={() => handleReport(message._id)} className="flex items-center hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300">
                              <Flag className="w-4 h-4 mr-1" /> Report
                            </button>
                          </div>
                           {/* --- NEW COMMENT SECTION --- */}
                          {activePostId === message._id && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-start gap-2 mb-4">
                                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." rows={2} className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none" />
                                <Button onClick={() => handleSubmitComment(message._id)} disabled={!newComment.trim()}>Post</Button>
                              </div>
                              <div className="space-y-3">
                                {isCommentsLoading ? <p className="text-sm text-gray-500">Loading comments...</p> : comments.map(comment => (
                                  <div key={comment._id} className="text-sm p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="font-semibold text-gray-800 dark:text-white">{comment.userId?.profile?.nickname || 'Anonymous'}</p>
                                    <p className="text-gray-600 dark:text-gray-300">{comment.body}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          </div>
        </div>
        
        <AnimatePresence>
          {showNewMessageForm && (
            <>
              <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewMessageForm(false)} />
              <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
                <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Share Your Voice Anonymously</h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Category</label>
                    <select value={newMessageCategory} onChange={e => setNewMessageCategory(e.target.value)} className="w-full p-3 glass border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 dark:text-white">
                      {categories.slice(1).map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Your Message</label>
                    <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Share what's on your mind..." rows={6} className="w-full p-4 glass border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none" />
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={() => setShowNewMessageForm(false)} variant="outline" className="flex-1 py-3">Cancel</Button>
                    <Button onClick={handleSubmitMessage} disabled={!newMessage.trim() || isLoading} className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3">
                      {isLoading ? "Posting..." : <><Send className="w-4 h-4 mr-2" /> Post Anonymously</>}
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