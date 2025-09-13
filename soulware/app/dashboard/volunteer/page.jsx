"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FiAlertTriangle, FiCheckCircle, FiLoader, FiUser, FiAward } from 'react-icons/fi';

export default function VolunteerDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [reports, setReports] = useState([]);
  // Add state to hold the user's profile data
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      async function fetchData() {
        try {
          // Fetch reports and the user's profile at the same time
          const [reportsRes, profileRes] = await Promise.all([
            fetch('/api/reports'),
            fetch('/api/users/me')
          ]);
          
          const reportsData = await reportsRes.json();
          const profileData = await profileRes.json();

          if (reportsData && !reportsData.error) {
            setReports(reportsData);
          }
          if (profileData && !profileData.error) {
            setProfile(profileData);
          }
        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Volunteer Moderation Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for helping keep our community safe, {profile?.profile?.displayName || 'Volunteer'}.
      </p>

      {/* NEW: Section for Volunteer Details */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="flex items-center justify-between">
           <div>
              <h3 className="text-lg font-bold flex items-center"><FiUser className="mr-2 text-blue-600"/>Your Details</h3>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">Focus Areas:</span> {profile?.volunteerProfile?.areas?.join(', ') || 'Not set'}
              </p>
           </div>
           <div>
              {profile?.volunteerProfile?.isApproved ? (
                 <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                   <FiCheckCircle className="mr-2"/> Approved
                 </span>
              ) : (
                 <span className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                   <FiAlertTriangle className="mr-2"/> Pending Approval
                 </span>
              )}
           </div>
        </div>
      </div>

      {/* Content Review Queue (no changes needed here) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center"><FiAlertTriangle className="mr-2 text-yellow-500"/>Content Review Queue</h2>
        </div>
        {reports.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {reports.map(report => (
              <li key={report._id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <span className="font-semibold capitalize">{report.targetType}</span> reported for:
                  <p className="text-gray-700 italic">"{report.reason}"</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Review</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center">
            <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-2"/>
            <p className="text-gray-600">The moderation queue is clear. Great work!</p>
          </div>
        )}
      </div>
    </div>
  );
}