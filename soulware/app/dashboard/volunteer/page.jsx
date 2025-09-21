"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Loader, X, Trash, Award, Users, TrendingUp, Shield, Star, Eye, ThumbsUp, MessageCircle, Calendar, Bell } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, color, description }) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -2 }}
    className={`bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 ${color}`}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </div>
    <p className="text-3xl font-black text-white">{value}</p>
  </motion.div>
);

export default function VolunteerDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [reports, setReports] = useState([]);
  const [positivePosts, setPositivePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('curation'); // 'curation' or 'moderation'

  // State for Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportedContent, setReportedContent] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [reportsRes, positivePostsRes] = await Promise.all([
          fetch("/api/reports"),
          fetch("/api/community/positive-posts") // New API to get top posts
      ]);
      const reportsData = await reportsRes.json();
      const positivePostsData = await positivePostsRes.json();
      
      if (reportsData && !reportsData.error) setReports(reportsData);
      if (positivePostsData && !positivePostsData.error) setPositivePosts(positivePostsData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchData();
    }
  }, [isLoaded, isSignedIn]);

  const handleReview = async (report) => {
    setSelectedReport(report);
    setIsReviewModalOpen(true);
    setReportedContent(null);
    try {
      if (report.targetType === 'post') {
        const res = await fetch(`/api/community/posts/${report.targetId}`);
        const data = await res.json();
        setReportedContent(data);
      }
    } catch (err) { console.error("Failed to fetch content:", err); }
  };
  
  const closeReviewModal = () => setIsReviewModalOpen(false);

  const handleDismissReport = async (reportId) => {
    await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
    setReports(prev => prev.filter(r => r._id !== reportId));
    closeReviewModal();
  };
  
  const handleDeletePost = async (postId) => {
      if (window.confirm("Are you sure you want to delete this post?")) {
          await fetch(`/api/community/posts/${postId}`, { method: 'DELETE' });
          setReports(prev => prev.filter(report => report.targetId !== postId));
          closeReviewModal();
      }
  };

  const handleNominatePost = async (postId) => {
      try {
          console.log("🎯 Nominating post:", postId);
          const response = await fetch(`/api/community/posts/${postId}/nominate`, { 
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              }
          });
          
          if (response.ok) {
              console.log("✅ Post nominated successfully");
              // Remove the post from the local list immediately for better UX
              setPositivePosts(prev => prev.filter(post => post._id !== postId));
              
              // Show success feedback
              alert("Post nominated successfully! It will now appear in the admin dashboard for review.");
              
              // Refresh the data to get new posts
              setTimeout(() => {
                  fetchData();
              }, 500);
          } else {
              const errorData = await response.json();
              console.error('Failed to nominate post:', errorData);
              alert('Failed to nominate post. Please try again.');
          }
      } catch (error) {
          console.error('Error nominating post:', error);
          alert('Error nominating post. Please check your connection and try again.');
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 text-center"
        >
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-purple-600" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Volunteer Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900 transition-all duration-1000">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <div className="text-center mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Volunteer Dashboard 💛
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Help curate the best of our community and keep it safe, {user?.firstName || "Volunteer"}! 🌟
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <StatCard 
                icon={Award} 
                title="Posts to Review" 
                value={positivePosts.length} 
                color="bg-gradient-to-r from-yellow-500 to-orange-500"
                description="Ready for nomination"
              />
              <StatCard 
                icon={Shield} 
                title="Reports Pending" 
                value={reports.length} 
                color="bg-gradient-to-r from-red-500 to-pink-500"
                description="Moderation queue"
              />
              <StatCard 
                icon={Users} 
                title="Community Impact" 
                value="High" 
                color="bg-gradient-to-r from-green-500 to-teal-500"
                description="Your contribution"
              />
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setView('curation')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                view === 'curation'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Award size={20} />
              <span className="hidden sm:inline">Community Curation</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                view === 'curation' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {positivePosts.length}
              </span>
            </motion.button>
            
            <motion.button
              onClick={() => setView('moderation')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 py-3 px-6 rounded-xl font-medium transition-all duration-300 relative ${
                view === 'moderation'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Shield size={20} />
              <span className="hidden sm:inline">Moderation Queue</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                view === 'moderation' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {reports.length}
              </span>
              {reports.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </motion.button>
          </div>
        </motion.div>
        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {view === 'curation' && (
            <motion.div
              key="curation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-600" />
                  Nominate Posts for Weekly Highlight
                </h2>
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>📋 Instructions:</strong> Review the top 10 most upvoted posts from this week. 
                    Nominate the best ones for admin review. Once nominated, posts will appear in the admin dashboard for final approval as weekly highlights.
                  </p>
                </div>
                {positivePosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {positivePosts.map((post, index) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 dark:bg-gray-800/10 backdrop-blur-sm rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-yellow-400"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                            {post.author?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2">{post.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                              {post.body.substring(0, 120)}...
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {post.upvotes?.length || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.comments?.length || 0}
                            </span>
                          </div>
                          <motion.button
                            onClick={() => handleNominatePost(post._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full hover:from-yellow-600 hover:to-orange-600 text-sm font-bold shadow-lg flex items-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            Nominate
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No posts available for nomination</p>
                    <p className="text-gray-400 text-sm">All top posts from this week have already been nominated or there are no posts yet.</p>
                    <p className="text-gray-400 text-xs mt-2">Check back later or ask the admin to perform a weekly reset.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'moderation' && (
            <motion.div
              key="moderation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-red-600" />
                  Content Review Queue
                </h2>
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report, index) => (
                      <motion.div
                        key={report._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 dark:bg-gray-800/10 backdrop-blur-sm rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                              <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-bold text-lg text-gray-800 dark:text-white capitalize">
                                {report.targetType} Report
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                "{report.reason}"
                              </p>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleReview(report)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 text-sm font-bold shadow-lg flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Review
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Moderation queue is clear!</p>
                    <p className="text-gray-400 text-sm">Great work keeping the community safe</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Modal */}
        <AnimatePresence>
          {isReviewModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
              onClick={closeReviewModal}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }} 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Review Reported Content</h2>
                  <motion.button 
                    onClick={closeReviewModal} 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {reportedContent ? (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border-l-4 border-yellow-500">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-1">Report Reason:</p>
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100">"{selectedReport.reason}"</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                      <h4 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">{reportedContent?.title}</h4>
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{reportedContent?.body}</p>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <motion.button 
                        onClick={() => handleDismissReport(selectedReport._id)} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors shadow-md"
                      >
                        Dismiss Report
                      </motion.button>
                      <motion.button 
                        onClick={() => handleDeletePost(selectedReport.targetId)} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-lg flex items-center gap-2"
                      >
                        <Trash className="w-4 h-4" />
                        Delete Post
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-48">
                    <Loader className="animate-spin w-8 h-8 text-purple-600" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

