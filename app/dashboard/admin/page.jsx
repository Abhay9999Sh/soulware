"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Users, BarChart2, Award, Sparkles, PlusCircle, Loader } from "lucide-react";

// --- Reusable Components (kept inside this file as requested) ---

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div whileHover={{ scale: 1.05 }} className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white`}>
    <div className="flex items-center gap-3 text-lg font-semibold"><Icon className="opacity-90" />{title}</div>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </motion.div>
);

const AnalyticsChart = ({ data }) => {
  const maxAppointments = Math.max(...data.map(d => d.appointments), 0) || 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 h-full">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Appointments This Week</h3>
      <div className="flex justify-between items-end h-48 space-x-2">
        {data.map((day, index) => (
          <div key={day.date} className="flex-1 flex flex-col items-center justify-end group">
            <div className="text-xs mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{day.appointments}</div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(day.appointments / maxAppointments) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="w-full bg-blue-500 rounded-t-md"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        if (res.ok) {
          setDashboardData(data);
        } else {
          throw new Error(data.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader className="animate-spin text-4xl text-blue-600" />
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
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Platform overview and management tools.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin/add-counselor">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow">
                <PlusCircle size={18} /> Add Counselor
              </button>
            </Link>
             <Link href="/dashboard/admin/add-volunteer">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition shadow">
                <PlusCircle size={18} /> Add Volunteer
              </button>
            </Link>
          </div>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={Users} title="Total Students" value={dashboardData?.keyMetrics.totalStudents ?? 0} color="from-blue-500 to-blue-600" />
            <StatCard icon={Users} title="Active Counselors" value={dashboardData?.keyMetrics.activeCounselors ?? 0} color="from-green-500 to-green-600" />
            <StatCard icon={BarChart2} title="Appointments" value={dashboardData?.keyMetrics.totalAppointments ?? 0} color="from-purple-500 to-purple-600" />
            
            <div className="md:col-span-3">
              <AnalyticsChart data={chartData} />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold flex items-center"><Award className="mr-2 text-amber-500" /> Nominations</h2>
              </div>
              {dashboardData?.mostEngagingPosts?.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
                  {dashboardData.mostEngagingPosts.map((post) => (
                    <li key={post._id} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-white">{post.title}</p>
                        <p className="text-xs text-gray-500">{post.body.substring(0, 40)}...</p>
                      </div>
                      <button className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold">Highlight</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center"><p className="text-sm text-gray-500">No nominated posts.</p></div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold flex items-center mb-3"><Sparkles className="mr-2 text-pink-500" /> AI Insights</h2>
              {dashboardData?.aiAnalysis ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">{dashboardData.aiAnalysis.summary}</p>
              ) : (
                <p className="text-sm text-gray-500">No AI insights available.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}