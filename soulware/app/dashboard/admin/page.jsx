"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { 
  Users, BarChart2, Award, PlusCircle, Loader, 
  Shield, TrendingUp, Crown, Star,
  UserCheck, Calendar, Eye, Sparkles
} from "lucide-react";

// --- Reusable Components (kept inside this file as requested) ---

const StatCard = ({ icon: Icon, title, value, color, description, trend }) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -2 }}
    className={`bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 ${color} relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-white/80 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-3xl font-black text-white mb-2">{value}</p>
      {description && (
        <p className="text-sm text-white/80">{description}</p>
      )}
    </div>
  </motion.div>
);

const AnalyticsChart = ({ data }) => {
  const maxAppointments = Math.max(...data.map(d => d.appointments), 0) || 1;
  const totalAppointments = data.reduce((sum, day) => sum + day.appointments, 0);

  return (
    <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            Weekly Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Appointment trends over the last 7 days</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {totalAppointments}
          </p>
          <p className="text-xs text-gray-500">Total this week</p>
        </div>
      </div>
      
      <div className="flex justify-between items-end h-32 space-x-2">
        {data.map((day, index) => (
          <div key={day.date} className="flex-1 flex flex-col items-center justify-end group">
            <motion.div
              className="text-xs mb-1 px-2 py-1 bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {day.appointments}
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ 
                height: day.appointments > 0 
                  ? `${Math.max((day.appointments / maxAppointments) * 80, 8)}px` 
                  : '2px' 
              }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md shadow-sm group-hover:from-blue-700 group-hover:to-blue-500 transition-colors"
              style={{ minHeight: '2px' }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
              {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Dashboard Page ---

export default function AdminDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Fetch main dashboard data (fast loading)
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        console.log("🚀 Loading admin dashboard...");
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        if (res.ok) {
          setDashboardData(data);
          console.log("✅ Dashboard data loaded successfully");
        } else {
          throw new Error(data.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("❌ Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoaded, isSignedIn]);

  // Handle highlighting a post
  const handleHighlightPost = async (postId) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isWeeklyHighlight: true })
      });
      
      if (response.ok) {
        // Remove the highlighted post from the local list
        setDashboardData(prev => ({
          ...prev,
          mostEngagingPosts: prev.mostEngagingPosts.filter(post => post._id !== postId)
        }));
        console.log("✅ Post highlighted successfully");
      } else {
        console.error('Failed to highlight post');
      }
    } catch (error) {
      console.error('Error highlighting post:', error);
    }
  };

  // Handle weekly reset
  const handleWeeklyReset = async () => {
    if (!confirm("Are you sure you want to reset all weekly highlights and nominations? This will clear all current nominations and highlights for a fresh week.")) {
      return;
    }
    
    try {
      const response = await fetch('/api/admin/weekly-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Weekly reset completed! Updated ${data.updatedCount} posts.`);
        // Refresh the dashboard data
        window.location.reload();
      } else {
        console.error('Failed to perform weekly reset');
        alert('Failed to perform weekly reset. Please try again.');
      }
    } catch (error) {
      console.error('Error performing weekly reset:', error);
      alert('Error performing weekly reset. Please check your connection and try again.');
    }
  };

  // Fetch AI insights separately (lazy loading)
  useEffect(() => {
    const fetchAiInsights = async () => {
      if (!dashboardData) return; // Wait for main data to load first
      
      setAiLoading(true);
      setAiError(null);
      
      try {
        console.log("🤖 Loading AI insights...");
        const res = await fetch("/api/admin/ai-insights");
        const data = await res.json();
        if (res.ok) {
          setAiInsights(data.aiAnalysis);
          console.log("✅ AI insights loaded successfully");
        } else {
          throw new Error(data.error || "Failed to fetch AI insights");
        }
      } catch (err) {
        console.error("❌ AI insights loading error:", err);
        setAiError(err.message);
      } finally {
        setAiLoading(false);
      }
    };

    // Delay AI insights loading by 500ms to ensure smooth dashboard rendering
    const timer = setTimeout(fetchAiInsights, 500);
    return () => clearTimeout(timer);
  }, [dashboardData]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 text-center"
        >
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Admin Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Prepare chart data with fallback for empty data
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const found = dashboardData?.appointmentTrend?.find(d => d.date === date);
    return { date, appointments: found?.appointments || 0 };
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-1000">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Professional Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 dark:from-slate-200 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Platform oversight and strategic management
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/dashboard/admin/add-counselor">
                    <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                      <UserCheck className="w-5 h-5" />
                      Add Counselor
                    </button>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/dashboard/admin/add-volunteer">
                    <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-xl font-bold hover:from-slate-700 hover:to-gray-800 transition-all shadow-lg">
                      <Shield className="w-5 h-5" />
                      Add Volunteer
                    </button>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button 
                    onClick={handleWeeklyReset}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Weekly Reset
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <StatCard 
            icon={Users} 
            title="Total Students" 
            value={dashboardData?.keyMetrics.totalStudents ?? 0} 
            color="bg-gradient-to-r from-blue-600 to-indigo-600"
            description="Registered users"
          />
          <StatCard 
            icon={UserCheck} 
            title="Active Counselors" 
            value={dashboardData?.keyMetrics.activeCounselors ?? 0} 
            color="bg-gradient-to-r from-green-600 to-emerald-600"
            description="Available professionals"
          />
          <StatCard 
            icon={Calendar} 
            title="Total Sessions" 
            value={dashboardData?.keyMetrics.totalAppointments ?? 0} 
            color="bg-gradient-to-r from-purple-600 to-violet-600"
            description="Completed appointments"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AnalyticsChart data={chartData} />
          </motion.div>

          {/* Sidebar Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Nominations Panel */}
            <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20">
              <div className="p-6 border-b border-white/10 dark:border-gray-700/20">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-500" />
                  Nominated Posts
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Posts nominated by volunteers for weekly highlight</p>
              </div>
              {dashboardData?.mostEngagingPosts?.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {dashboardData.mostEngagingPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border-b border-white/5 dark:border-gray-700/10 last:border-b-0 hover:bg-white/5 dark:hover:bg-gray-800/10 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-800 dark:text-white mb-1">{post.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{post.body.substring(0, 60)}...</p>
                        </div>
                        <motion.button
                          onClick={() => handleHighlightPost(post._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:from-amber-600 hover:to-orange-600 transition-all"
                        >
                          <Star className="w-3 h-3" />
                          Highlight
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No nominations pending</p>
                  <p className="text-xs text-gray-400 mt-1">Volunteers haven't nominated any posts yet</p>
                </div>
              )}
            </div>


            {/* AI Insights Panel with Lazy Loading */}
            <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Insights
                {aiLoading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader className="w-4 h-4 text-purple-500" />
                  </motion.div>
                )}
              </h2>
              
              <AnimatePresence mode="wait">
                {aiInsights ? (
                  <motion.div
                    key="ai-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {aiInsights.summary}
                    </p>
                    {aiInsights.commonIssues && aiInsights.commonIssues.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Common Issues:</p>
                        <div className="flex flex-wrap gap-1">
                          {aiInsights.commonIssues.map((issue, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
                            >
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                      <Eye className="w-3 h-3" />
                      <span>Generated from platform analytics</span>
                    </div>
                  </motion.div>
                ) : aiLoading ? (
                  <motion.div
                    key="ai-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-sm text-gray-500">Generating AI insights...</p>
                    <p className="text-xs text-gray-400 mt-1">This may take a few moments</p>
                  </motion.div>
                ) : aiError ? (
                  <motion.div
                    key="ai-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-500 text-xl">⚠️</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-2">Failed to load AI insights</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Retry
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ai-waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Waiting to load AI insights...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}