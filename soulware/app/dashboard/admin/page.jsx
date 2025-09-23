"use client"
import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import {
  Users,
  BarChart2,
  Award,
  Loader,
  Shield,
  Crown,
  Star,
  UserCheck,
  Calendar,
  Eye,
  Sparkles,
  Trash2,
  Mail,
  UserCircle,
  PlusCircle
} from "lucide-react"

// --- Main Dashboard Page ---
export default function AdminDashboard() {
  const { isLoaded, isSignedIn } = useUser()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [aiInsights, setAiInsights] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  const [counselors, setCounselors] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [cLoading, setCLoading] = useState(false)
  const [vLoading, setVLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [counselorRatings, setCounselorRatings] = useState({})

  // Prepare chart data with fallback for empty data
  const last7Days = useMemo(
    () =>
      Array.from({ length: 7 })
        .map((_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - i)
          return d.toISOString().split("T")[0]
        })
        .reverse(),
    []
  )

  // Fetch main dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn) return
      try {
        const res = await fetch("/api/admin/dashboard")
        const data = await res.json()
        if (res.ok) {
          setDashboardData(data)
        } else {
          throw new Error(data.error || "Failed to fetch dashboard data")
        }
      } catch (err) {
        console.error("Dashboard loading error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isLoaded, isSignedIn])

  // Fetch counselors
  useEffect(() => {
    const run = async () => {
      if (!isLoaded || !isSignedIn) {
        console.log('Skipping counselors fetch - not loaded or not signed in');
        return;
      }
      setCLoading(true)
      try {
        console.log('Fetching counselors...');
        const res = await fetch("/api/counselors", { cache: "no-store" })
        const data = await res.json()
        console.log('Counselors response:', { status: res.status, data });
        if (res.ok) {
          const counselorsList = data.items || data || [];
          setCounselors(counselorsList);
          
          // Fetch ratings for each counselor
          const ratingsPromises = counselorsList.map(async (counselor) => {
            try {
              const ratingRes = await fetch(`/api/ratings?counselorId=${counselor._id}`);
              if (ratingRes.ok) {
                const ratingData = await ratingRes.json();
                return { counselorId: counselor._id, ...ratingData };
              }
            } catch (error) {
              console.error(`Error fetching rating for counselor ${counselor._id}:`, error);
            }
            return { counselorId: counselor._id, averageRating: 0, totalRatings: 0 };
          });
          
          const ratingsResults = await Promise.all(ratingsPromises);
          const ratingsMap = {};
          ratingsResults.forEach(rating => {
            ratingsMap[rating.counselorId] = rating;
          });
          setCounselorRatings(ratingsMap);
        }
        else throw new Error(data.error || "Failed to fetch counselors")
      } catch (e) {
        console.error("Fetch counselors error:", e)
      } finally {
        setCLoading(false)
      }
    }
    run()
  }, [isLoaded, isSignedIn])

  // Fetch volunteers
  useEffect(() => {
    const run = async () => {
      if (!isLoaded || !isSignedIn) {
        console.log('Skipping volunteers fetch - not loaded or not signed in');
        return;
      }
      setVLoading(true)
      try {
        console.log('Fetching volunteers...');
        const res = await fetch("/api/volunteers", { cache: "no-store" })
        const data = await res.json()
        console.log('Volunteers response:', { status: res.status, data });
        if (res.ok) setVolunteers(data.items || data || [])
        else throw new Error(data.error || "Failed to fetch volunteers")
      } catch (e) {
        console.error("Fetch volunteers error:", e)
      } finally {
        setVLoading(false)
      }
    }
    run()
  }, [isLoaded, isSignedIn])

  // Handle highlighting a post
  const handleHighlightPost = async postId => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isWeeklyHighlight: true })
      })
      if (response.ok) {
        setDashboardData(prev =>
          prev
            ? {
                ...prev,
                mostEngagingPosts: prev.mostEngagingPosts.filter(
                  post => post._id !== postId
                )
              }
            : null
        )
      } else {
        console.error("Failed to highlight post")
      }
    } catch (error) {
      console.error("Error highlighting post:", error)
    }
  }

  // Handle weekly reset
  const handleWeeklyReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all weekly highlights and nominations? This will clear all current nominations and highlights for a fresh week."
      )
    ) {
      return
    }
    try {
      const response = await fetch("/api/admin/weekly-reset", {
        method: "POST"
      })
      if (response.ok) {
        const data = await response.json()
        alert(`Weekly reset completed! Updated ${data.updatedCount} posts.`)
        window.location.reload()
      } else {
        alert("Failed to perform weekly reset. Please try again.")
      }
    } catch (error) {
      console.error("Error performing weekly reset:", error)
      alert(
        "Error performing weekly reset. Please check your connection and try again."
      )
    }
  }

  // Fetch AI insights
  useEffect(() => {
    const fetchAiInsights = async () => {
      if (!dashboardData) return
      setAiLoading(true)
      setAiError(null)
      try {
        const res = await fetch("/api/admin/ai-insights")
        const data = await res.json()
        if (res.ok) {
          setAiInsights(data.aiAnalysis)
        } else {
          throw new Error(data.error || "Failed to fetch AI insights")
        }
      } catch (err) {
        console.error("AI insights loading error:", err)
        setAiError(err.message)
      } finally {
        setAiLoading(false)
      }
    }
    const timer = setTimeout(fetchAiInsights, 500)
    return () => clearTimeout(timer)
  }, [dashboardData])

  const chartData = last7Days.map(date => {
    const found = dashboardData?.appointmentTrend?.find(d => d.date === date)
    return { date, appointments: found?.appointments || 0 }
  })

  const handleDeleteCounselor = async counselor => {
    if (!counselor?.userId || !confirm("Delete this counselor? This action cannot be undone.")) return
    setDeletingId(counselor.userId)
    try {
      const res = await fetch(`/api/counselors/${counselor.userId}`, { method: "DELETE" })
      if (res.ok) {
        setCounselors(prev => prev.filter(c => c.userId !== counselor.userId))
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.error || "Failed to delete counselor")
      }
    } catch (e) {
      console.error(e)
      alert("Network error deleting counselor")
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteVolunteer = async (id) => {
  if (!id) return;

  try {
    setDeletingId(id);
    const res = await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setVolunteers(prev => prev.filter(v => v._id !== id));
    } else {
      console.error('Failed to delete volunteer:', await res.json());
    }
  } catch (error) {
    console.error('Error deleting volunteer:', error);
  } finally {
    setDeletingId(null);
  }
};


  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 text-center"
        >
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading Admin Dashboard...
          </p>
        </motion.div>
      </div>
    )
  }

  // --- Reusable Components ---
  const StatCard = ({ icon: Icon, title, value, color, description }) => (
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
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-3xl font-black text-white mb-2">{value}</p>
        {description && <p className="text-sm text-white/80">{description}</p>}
      </div>
    </motion.div>
  )

  const AnalyticsChart = ({ data }) => {
    const maxAppointments = Math.max(...data.map(d => d.appointments), 0) || 1
    const totalAppointments = data.reduce(
      (sum, day) => sum + day.appointments,
      0
    )

    return (
      <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              Weekly Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Appointment trends over the last 7 days
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {totalAppointments}
            </p>
            <p className="text-xs text-gray-500">Total this week</p>
          </div>
        </div>
        <div className="flex justify-between items-end h-32 gap-2">
          {data.map((day, index) => (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center justify-end group"
            >
              <motion.div className="text-xs mb-1 px-2 py-1 bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {day.appointments}
              </motion.div>
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height:
                    day.appointments > 0
                      ? `${Math.max(
                          (day.appointments / maxAppointments) * 80,
                          8
                        )}px`
                      : "2px"
                }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md shadow-sm group-hover:from-blue-700 group-hover:to-blue-500 transition-colors"
                style={{ minHeight: "2px" }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short"
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const PersonRow = ({ item, onDelete, deleting, rating }) => {
    const joinedDate = item.createdAt
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          year: "numeric"
        }).format(new Date(item.createdAt))
      : ""
    return (
      <div className="flex items-center justify-between p-4 border-b border-white/5 dark:border-gray-700/10 hover:bg-white/5 dark:hover:bg-gray-800/10 transition-colors">
        <div className="flex items-center gap-4 min-w-0">
          <UserCircle className="w-10 h-10 text-gray-400 dark:text-gray-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {item.name || "Unknown"}
              </h3>
              {rating && (
                <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    {rating.averageRating > 0 ? rating.averageRating.toFixed(1) : 'New'}
                    {rating.totalRatings > 0 && (
                      <span className="ml-1 text-yellow-600 dark:text-yellow-400">
                        ({rating.totalRatings})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {item.qualification || "No qualification listed"} • Joined {joinedDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {item.clerkId && (
            <Link href={`/dashboard/admin/users/${item.clerkId}`} passHref>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                aria-label="View profile"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </Link>
          )}
          <motion.button
            onClick={() => onDelete(item)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={deleting}
            className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 transition-colors"
            aria-label={`Delete ${item.name}`}
          >
            {deleting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>
    )
  }

  const PersonRowSkeleton = () => (
    <div className="flex items-center justify-between p-4 border-b border-white/5 dark:border-gray-700/10">
      <div className="flex items-center gap-4 w-full">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0"></div>
        <div className="w-full space-y-2">
          <div className="h-4 w-2/5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="h-3 w-3/5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
      </div>
    </div>
  )

  const EmptyState = ({ title, description, link, buttonText, Icon }) => (
    <div className="text-center p-10">
      <Icon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div className="mt-6">
        <Link href={link}>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusCircle className="h-5 w-5" />
            {buttonText}
          </button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-1000">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/dashboard/admin/add-counselor">
                    <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                      <UserCheck className="w-5 h-5" />
                      Add Counselor
                    </button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/dashboard/admin/add-volunteer">
                    <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-xl font-bold hover:from-slate-700 hover:to-gray-800 transition-all shadow-lg">
                      <Shield className="w-5 h-5" />
                      Add Volunteer
                    </button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
            value={dashboardData?.keyMetrics?.totalStudents ?? 0}
            color="bg-gradient-to-r from-blue-600 to-indigo-600"
            description="Registered users"
          />
          <StatCard
            icon={UserCheck}
            title="Total Counselors"
            value={dashboardData?.keyMetrics?.activeCounselors ?? 0}
            color="bg-gradient-to-r from-green-600 to-emerald-600"
            description="Registered professionals"
          />
          <StatCard
            icon={Calendar}
            title="Total Sessions"
            value={dashboardData?.keyMetrics?.totalAppointments ?? 0}
            color="bg-gradient-to-r from-purple-600 to-violet-600"
            description="Completed appointments"
          />
        </motion.div>

        {/* Enhanced Dashboard Grid */}
        <div className="grid grid-cols-1  gap-8 mb-8">
          {/* Main Analytics - Takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-3"
          >
            <AnalyticsChart data={chartData} />
          </motion.div>

          
        </div>

        {/* Secondary Grid - AI Insights and Nominations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 h-full">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-blue-500" />
                AI Insights
                {aiLoading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Loader className="w-4 h-4 text-blue-500" />
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
                    className="space-y-4"
                  >
                    {/* Summary Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {aiInsights.summary}
                      </p>
                    </div>
                    
                    {/* Common Issues Section */}
                    {aiInsights.commonIssues?.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Common Issues Identified:
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {aiInsights.commonIssues.map((issue, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50 rounded-lg p-3 text-center"
                            >
                              <span className="text-xs font-medium text-purple-700 dark:text-purple-300 block">
                                {issue}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : aiLoading ? (
                  <motion.div
                    key="ai-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-sm text-gray-500">
                      Generating AI insights...
                    </p>
                  </motion.div>
                ) : aiError ? (
                  <motion.div
                    key="ai-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-500 text-xl">⚠️</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Failed to load insights
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ai-waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      Waiting for data to load...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Nominations Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 h-full">
              <div className="p-6 border-b border-white/10 dark:border-gray-700/20">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                  <Award className="w-5 h-5 text-pink-500" />
                  Nominated Posts
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Posts nominated for weekly highlight
                </p>
              </div>
              {dashboardData?.mostEngagingPosts?.length ?? 0 > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {dashboardData?.mostEngagingPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border-b border-white/5 dark:border-gray-700/10 last:border-b-0 hover:bg-white/5 dark:hover:bg-gray-800/10 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-800 dark:text-white mb-1">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {post.body.substring(0, 60)}...
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleHighlightPost(post._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:from-pink-600 hover:to-orange-600 transition-all"
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
                  <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    No nominations pending
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* System Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">System Health</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All systems operational</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Database</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connection stable</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Connected</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">AI Services</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gemini API active</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <div className="p-6 border-b border-white/10 dark:border-gray-700/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-500" /> All Counselors
              </h2>
            </div>
            <div className="max-h-[28rem] overflow-y-auto">
              {cLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <PersonRowSkeleton key={i} />
                ))
              ) : counselors.length > 0 ? (
                counselors
                  .filter(c => c && c._id) // <-- FIX: Filter out items without an ID
                  .map(c => (
                    <PersonRow
                      key={c._id}
                      item={c}
                      onDelete={handleDeleteCounselor}
                      deleting={deletingId === c.userId}
                      rating={counselorRatings[c._id]}
                    />
                  ))
              ) : (
                <EmptyState
                  title="No counselors found"
                  description="Get started by adding a new counselor."
                  link="/dashboard/admin/add-counselor"
                  buttonText="Add Counselor"
                  Icon={Users}
                />
              )}
            </div>
          </div>

          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <div className="p-6 border-b border-white/10 dark:border-gray-700/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <Shield className="w-5 h-5 text-pink-500" /> All Volunteers
              </h2>
            </div>
            <div className="max-h-[28rem] overflow-y-auto">
              {vLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <PersonRowSkeleton key={i} />
                ))
              ) : volunteers.length > 0 ? (
                volunteers
                  .filter(v => v && v._id) // <-- FIX: Filter out items without an ID
                  .map(v => (
                    <PersonRow
                      key={v._id}
                      item={v}
                      onDelete={() => handleDeleteVolunteer(v._id)} // <-- pass just the id
                      deleting={deletingId === v._id}
                    />
                  ))
              ) : (
                <EmptyState
                  title="No volunteers found"
                  description="Get started by adding a new volunteer."
                  link="/dashboard/admin/add-volunteer"
                  buttonText="Add Volunteer"
                  Icon={Shield}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
