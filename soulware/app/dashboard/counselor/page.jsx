"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FiCalendar, FiClock, FiUserCheck, FiLoader } from 'react-icons/fi';

export default function CounselorDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      async function fetchData() {
        try {
          const res = await fetch('/api/appointments/counselor');
          const data = await res.json();
          if (data && !data.error) {
            setAppointments(data);
          }
        } catch (err) {
          console.error("Failed to fetch appointments:", err);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Counselor Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><FiCalendar className="mr-2"/>Upcoming Appointments</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {appointments.length > 0 ? appointments.map(appt => (
                <li key={appt._id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{appt.studentName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(appt.scheduledFor).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {appt.status}
                    </span>
                    <button className="text-blue-600 hover:underline text-sm">View Details</button>
                  </div>
                </li>
              )) : <p className="p-4 text-gray-500">No upcoming appointments.</p>}
            </ul>
          </div>
        </div>
        <div className="space-y-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center"><FiUserCheck className="mr-2"/>Your Profile</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-700">Manage your qualifications, bio, and other professional details.</p>
              <button className="mt-3 w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                Edit Profile
              </button>
            </div>
          </div>
           <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center"><FiClock className="mr-2"/>Manage Availability</h2>
             <div className="bg-white p-4 rounded-lg shadow">
               <p className="text-gray-700">Set the days and times you are available for student appointments.</p>
               <button className="mt-3 w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update Schedule
              </button>
             </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

