"use client";
import React, { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs"; // This line is removed to resolve the error
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK useUser hook to remove external dependency ---
// In a real application, you would import this from "@clerk/nextjs"
const useUser = () => {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'user_mock_12345',
      fullName: 'Valiant Volunteer',
      firstName: 'Valiant',
    },
  };
};

// --- SVG Icon Components (to remove external dependency) ---
const IconAlertTriangle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const IconCheckCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const IconLoader = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);
const IconX = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
const IconTrash = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);
const IconAward = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline>
    </svg>
);

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white`}>
    <div className="flex items-center gap-3 mb-4">
      <Icon className="text-3xl opacity-90" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-4xl font-bold">{value}</p>
  </div>
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
      await fetch(`/api/community/posts/${postId}/nominate`, { method: 'PATCH' });
      // Remove the post from the local list to give feedback
      setPositivePosts(prev => prev.filter(post => post._id !== postId));
  };

  return (
    <div className="p-6 space-y-10">
      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Volunteer Dashboard 💛</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Help curate the best of our community and keep it safe, {user?.firstName || "Volunteer"}!</p>
      </motion.section>

      {/* View Toggle */}
      <div className="flex justify-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full w-fit mx-auto">
          <button onClick={() => setView('curation')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'curation' ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              Community Curation
          </button>
          <button onClick={() => setView('moderation')} className={`px-6 py-2 rounded-full text-sm font-semibold relative transition-colors ${view === 'moderation' ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              Moderation Queue
              {reports.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-100 dark:border-gray-800"></span>}
          </button>
      </div>
      
      {loading ? <div className="flex justify-center items-center h-48"><IconLoader className="animate-spin text-4xl text-blue-600" /></div> : (
        <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {view === 'curation' ? (
                    <section id="curation-view" className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center flex items-center justify-center gap-3"><IconAward className="text-amber-500" /> Nominate a Post for Highlight</h2>
                        {positivePosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {positivePosts.map(post => (
                                    <div key={post._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-transparent hover:border-green-500 transition-all">
                                        <p className="font-semibold text-gray-800 dark:text-white">{post.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">{post.body.substring(0, 100)}...</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-500">{post.upvotes.length} Upvotes</span>
                                            <button onClick={() => handleNominatePost(post._id)} className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 text-xs font-semibold">Nominate</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl"><IconCheckCircle className="mx-auto text-4xl text-green-500 mb-2" /><p className="text-gray-600 dark:text-gray-300">No new positive posts to nominate right now.</p></div>
                        )}
                    </section>
                ) : (
                    <section id="moderation-view" className="space-y-6">
                        <StatCard icon={IconAlertTriangle} title="Pending Reports to Review" value={reports.length} color="from-yellow-500 to-orange-500" />
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold flex items-center"><IconAlertTriangle className="mr-2 text-yellow-500" /> Content Review Queue</h2>
                            </div>
                            {reports.length > 0 ? (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">{reports.map(report => (
                                    <li key={report._id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="mb-2 sm:mb-0">
                                            <span className="font-semibold capitalize">{report.targetType}</span> reported for: <p className="text-gray-700 dark:text-gray-300 italic">"{report.reason}"</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                             <button onClick={() => handleReview(report)} className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs font-semibold">Review</button>
                                        </div>
                                    </li>
                                ))}</ul>
                            ) : (
                                <div className="p-6 text-center"><IconCheckCircle className="mx-auto text-4xl text-green-500 mb-2" /><p>The moderation queue is clear. Great work!</p></div>
                            )}
                        </div>
                    </section>
                )}
            </motion.div>
        </AnimatePresence>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={closeReviewModal}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold">Review Reported Content</h2>
                    <button onClick={closeReviewModal} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><IconX /></button>
                </div>
                {reportedContent ? (
                    <div>
                        <div className="mb-4 p-4 bg-yellow-50 dark:bg-gray-700/50 rounded-lg">
                            <p><strong className="font-semibold">Reason:</strong> {selectedReport.reason}</p>
                        </div>
                        <div className="mb-6 p-4 border rounded-lg">
                            <h4 className="font-semibold text-lg mb-2">{reportedContent?.title}</h4>
                            <p className="text-gray-600 dark:text-gray-300">{reportedContent?.body}</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => handleDismissReport(selectedReport._id)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Dismiss Report</button>
                            <button onClick={() => handleDeletePost(selectedReport.targetId)} className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"><IconTrash className="w-4 h-4" /> Delete Post</button>
                        </div>
                    </div>
                ) : ( <div className="flex justify-center items-center h-48"><IconLoader className="animate-spin text-3xl" /></div> )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

