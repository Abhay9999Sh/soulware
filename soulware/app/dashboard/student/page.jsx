"use client";
import React, { useState, useEffect } from 'react';
// We need to import the useUser hook from Clerk
import { useUser } from '@clerk/nextjs'; 
import { FiMessageSquare, FiCalendar, FiBookOpen, FiUsers, FiLoader } from 'react-icons/fi';

const DashboardCard = ({ icon, title, description, link }) => (
  <a href={link} className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition">
    <div className="flex items-center mb-2">
      <div className="text-2xl text-blue-600 mr-4">{icon}</div>
      <h5 className="text-xl font-bold tracking-tight text-gray-900">{title}</h5>
    </div>
    <p className="font-normal text-gray-700">{description}</p>
  </a>
);

export default function StudentDashboard() {
  // Get the status of the Clerk user session
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  
  const [dbUser, setDbUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This condition is crucial: only fetch if Clerk is loaded AND user is signed in
    if (isLoaded && isSignedIn) {
      async function fetchData() {
        try {
          const [userRes, appointmentsRes] = await Promise.all([
            fetch('/api/users/me'),
            fetch('/api/appointments/student')
          ]);
          
          const userData = await userRes.json();
          const appointmentsData = await appointmentsRes.json();

          if (userData && !userData.error) {
            setDbUser(userData);
          }
          if (appointmentsData && !appointmentsData.error) {
            setAppointments(appointmentsData);
          }

        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]); // The effect must depend on the session status

  // Show a loading spinner while Clerk is initializing
  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }
  
  if (!isSignedIn) {
      return <p className="text-center mt-10">Please sign in to view your dashboard.</p>
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome back, {dbUser?.profile?.nickname || clerkUser?.firstName || 'there'}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">Your mental wellness hub. We're here to support you.</p>

      {/* Grid layout (no changes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard icon={<FiMessageSquare />} title="AI First-Aid Chatbot" link="/chat" description="Get immediate, guided support and coping strategies from our friendly AI assistant, available 24/7."/>
        <DashboardCard icon={<FiCalendar />} title="Book an Appointment" link="/booking" description="Schedule a confidential session with a professional on-campus counselor at your convenience."/>
        <DashboardCard icon={<FiBookOpen />} title="Resource Hub" link="/resources" description="Explore articles, videos, and relaxation audio guides on various mental wellness topics."/>
        <DashboardCard icon={<FiUsers />} title="Peer Support Forum" link="/forum" description="Connect with fellow students in a moderated, anonymous space to share experiences and support each other."/>
      </div>

      {/* Upcoming Appointments (no changes) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Upcoming Appointments</h2>
        <div className="bg-white p-4 rounded-lg shadow divide-y divide-gray-200">
          {appointments.length > 0 ? (
            appointments.map(appt => (
              <div key={appt._id} className="flex justify-between items-center p-3">
                <div>
                  <p className="font-semibold">{appt.counselorName || 'A Counselor'}</p>
                  <p className="text-sm text-gray-600">
                    Scheduled for: {new Date(appt.scheduledFor).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {appt.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 p-3">You have no upcoming appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
}