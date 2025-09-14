"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- Mock useUser for auth (replace with Clerk hook in production) ---
const useUser = () => ({
  isLoaded: true,
  isSignedIn: true,
});

// --- SVG Icons ---
const IconUsers = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconUserCheck = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>;
const IconBarChart2 = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const IconLoader = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;
const IconCheckCircle = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconClipboard = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3"/><path d="M9 2a2 2 0 0 0 0 4h6a2 2 0 0 0 0-4"/></svg>;

// Gradient card component for stats
const GradientCard = ({ icon: Icon, title, value, color }) => (
  <motion.div whileHover={{ scale: 1.05 }} className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white`}>
    <div className="flex items-center gap-3"><Icon className="text-3xl opacity-90" /><h3 className="text-lg font-semibold">{title}</h3></div>
    <p className="text-3xl font-bold mt-4">{value}</p>
  </motion.div>
);

// Helper to format time ago
const formatTimeAgo = (date) => {
  const diff = (new Date() - new Date(date)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function AdminDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [stats, setStats] = useState({ totalUsers: 0, pendingApprovals: 0, totalAppointments: 0 });
  const [activity, setActivity] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes, postsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/student-activity"),
        fetch("/api/community/posts/nominated"),
      ]);

      const statsData = await statsRes.json();
      const activityData = await activityRes.json();
      const postsData = await postsRes.json();

      if (statsData && !statsData.error) setStats(statsData);
      if (activityData && !activityData.error) setActivity(activityData.activity);
      if (postsData && !postsData.error) setNominations(postsData.posts);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchData();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return <div className="flex justify-center items-center h-screen"><IconLoader className="animate-spin text-4xl text-blue-600" /></div>;
  }

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard ⚡</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Oversee platform stats, student activity, and community posts.</p>
      </motion.section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GradientCard icon={IconUsers} title="Total Users" value={stats.totalUsers} color="from-blue-500 to-blue-600" />
        <GradientCard icon={IconUserCheck} title="Pending Approvals" value={stats.pendingApprovals} color="from-green-500 to-green-600" />
        <GradientCard icon={IconBarChart2} title="Appointments" value={stats.totalAppointments} color="from-purple-500 to-purple-600" />
      </section>

      {/* Student Activity Feed */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center"><IconUsers className="mr-2 text-indigo-500" /> Recent Student Activity</h2>
        </div>
        {activity.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activity.map((item, index) => (
              <li key={index} className="p-4 flex items-center gap-4">
                <div className={`rounded-full p-2 ${item.type === 'new_user' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                  {item.type === 'new_user' ? <IconUsers className="text-blue-600" /> : <IconClipboard className="text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{item.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(item.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center">
            <IconCheckCircle className="mx-auto text-4xl text-green-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">No recent student activity.</p>
          </div>
        )}
      </section>

      {/* Nominated Posts */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center"><IconClipboard className="mr-2 text-amber-500" /> Nominated Posts</h2>
        </div>
        {nominations.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {nominations.map((post) => (
              <li key={post._id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="font-semibold text-gray-800 dark:text-white">{post.title}</p>
                  <p className="text-sm text-gray-500">{post.body.substring(0, 100)}...</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center">
            <IconCheckCircle className="mx-auto text-4xl text-green-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">No posts have been nominated yet.</p>
          </div>
        )}
      </section>

      {/* Admin Actions */}
      <section className="flex flex-wrap gap-4">
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Add Counselor</button>
        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">Add Volunteer</button>
      </section>
    </div>
  );
}
