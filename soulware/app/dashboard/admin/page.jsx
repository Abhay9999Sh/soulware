"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- Mock useUser for auth (replace with Clerk hook in production) ---
const useUser = () => ({
  isLoaded: true,
  isSignedIn: true,
});

// --- SVG Icons ---
const IconUsers = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const IconBarChart2 = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);
const IconLoader = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
);
const IconAward = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>
);
const IconSparkles = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2z"></path><path d="M5 2L6 5"></path><path d="M19 2L18 5"></path><path d="M22 19L19 18"></path><path d="M2 5L5 6"></path></svg>
);
const IconPlus = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

// --- Components ---
const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div whileHover={{ scale: 1.05 }} className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white`}>
    <div className="flex items-center gap-3"><Icon className="text-3xl opacity-90" /><h3 className="text-lg font-semibold">{title}</h3></div>
    <p className="text-4xl font-bold mt-4">{value}</p>
  </motion.div>
);

const AnalyticsChart = ({ data }) => {
  const maxAppointments = Math.max(...data.map(d => d.appointments), 0) || 1;
  const days = data.map(d => new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 h-full">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Appointments This Week</h3>
      <div className="flex justify-between items-end h-48 space-x-2">
        {data.map((day, index) => (
          <div key={day.date} className="flex-1 flex flex-col items-center justify-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(day.appointments / maxAppointments) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="w-full bg-blue-500 rounded-t-md"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{days[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddEntityCard = ({ type, onClick }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer" onClick={onClick}>
    <div className="flex items-center gap-3">
      <IconPlus className="text-3xl opacity-90" />
      <h3 className="text-lg font-semibold">Add {type}</h3>
    </div>
    <p className="text-sm mt-4 opacity-80">Register a new {type.toLowerCase()} to the platform.</p>
  </motion.div>
);

// --- Main Page ---
export default function AdminDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(null); // "counselor" | "volunteer" | null

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data && !data.error) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchData();
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900"><IconLoader className="animate-spin text-4xl text-blue-600" /></div>;
  }

  // Fill in empty days for the chart
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const found = dashboardData?.appointmentTrend.find(d => d.date === date);
    return { date, appointments: found?.appointments || 0 };
  });

  return (
    <div className="p-6 space-y-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Admin Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Monitor platform health, manage highlights, and onboard new team members.</p>
      </motion.section>

      {/* Add Entities */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddEntityCard type="Counselor" onClick={() => setShowForm("counselor" )} />
        <AddEntityCard type="Volunteer" onClick={() => setShowForm("volunteer" )} />
      </section>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add {showForm === "counselor" ? "Counselor" : "Volunteer"}</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            <input type="text" placeholder="Specialization / Role" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(null)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Stats + Nominations + Chart + Student Activity + AI Insights + What's Going On */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <StatCard icon={IconUsers} title="Total Students" value={dashboardData?.keyMetrics.totalStudents || 0} color="from-blue-500 to-blue-600" />
          <StatCard icon={IconUsers} title="Active Counselors" value={dashboardData?.keyMetrics.activeCounselors || 0} color="from-green-500 to-green-600" />
          <StatCard icon={IconBarChart2} title="Total Appointments" value={dashboardData?.keyMetrics.totalAppointments || 0} color="from-purple-500 to-purple-600" />

          {/* Nominations */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold flex items-center"><IconAward className="mr-2 text-amber-500" /> Nominations</h2>
            </div>
            {dashboardData?.mostEngagingPosts?.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
                {dashboardData.mostEngagingPosts.map((post) => (
                  <li key={post._id} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm text-gray-800 dark:text-white">{post.title}</p>
                      <p className="text-xs text-gray-500">{post.body.substring(0, 40)}...</p>
                    </div>
                    <button className="px-3 py-1 bg-amber-500 text-white rounded-full hover:bg-amber-600 text-xs font-semibold flex-shrink-0 transition-colors">
                      Highlight
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center"><p className="text-sm text-gray-500">No nominated posts.</p></div>
            )}
          </div>

          {/* AI Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold flex items-center"><IconSparkles className="mr-2 text-pink-500" /> AI Insights</h2>
            {dashboardData?.aiAnalysis ? (
              <div className="mt-3 space-y-2">
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                  {dashboardData.aiAnalysis.commonIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{dashboardData.aiAnalysis.summary}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-3">No AI insights available.</p>
            )}
          </div>
        </div>

        {/* Right Column: Weekly Chart + Student Activity + What's Going On */}
        <div className="lg:col-span-2 space-y-6">
          {dashboardData?.appointmentTrend ? (
            <AnalyticsChart data={chartData} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 h-full flex items-center justify-center"><IconLoader className="animate-spin"/></div>
          )}

          {/* Student Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Student Activity</h3>
            {dashboardData?.studentActivity?.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.studentActivity.map((activity, idx) => (
                  <li key={idx} className="py-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{activity.description}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No recent activity.</p>
            )}
          </div>

          {/* What's Going On */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">What's Going On</h3>
            {dashboardData?.topCommunityTopics?.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                {dashboardData.topCommunityTopics.map((topic, idx) => (
                  <li key={idx}>{topic.name} ({topic.value})</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No trending topics found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}