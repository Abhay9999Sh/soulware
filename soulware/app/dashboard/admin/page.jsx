"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FiUsers, FiUserCheck, FiBarChart2, FiEdit, FiShield, FiLoader } from 'react-icons/fi';

const AdminStatCard = ({ icon, title, value, link }) => (
  <a href={link} className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50 transition">
    <div className="flex items-center">
      <div className="text-3xl text-blue-600 mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </a>
);

export default function AdminDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [stats, setStats] = useState({ totalUsers: 0, pendingApprovals: 0, totalAppointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      async function fetchStats() {
        try {
          const res = await fetch('/api/admin/stats');
          const data = await res.json();
          if (data && !data.error) {
            setStats(data);
          }
        } catch (err) {
          console.error("Failed to fetch admin stats:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchStats();
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Administrative Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <AdminStatCard icon={<FiUsers/>} title="Total Users" value={stats.totalUsers} link="/admin/users" />
        <AdminStatCard icon={<FiUserCheck/>} title="Pending Approvals" value={stats.pendingApprovals} link="/admin/approvals" />
        <AdminStatCard icon={<FiBarChart2/>} title="Total Appointments" value={stats.totalAppointments} link="/admin/analytics" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="/admin/users/new" className="p-5 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <FiUsers className="mx-auto text-2xl mb-2" />
          <span className="font-semibold">Manage Users</span>
          <p className="text-sm text-blue-100">Add, edit, or suspend users.</p>
        </a>
        <a href="/admin/resources" className="p-5 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          <FiEdit className="mx-auto text-2xl mb-2" />
          <span className="font-semibold">Manage Resources</span>
          <p className="text-sm text-green-100">Add or update articles and guides.</p>
        </a>
        <a href="/admin/analytics" className="p-5 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          <FiBarChart2 className="mx-auto text-2xl mb-2" />
          <span className="font-semibold">View Analytics</span>
          <p className="text-sm text-indigo-100">See usage trends and reports.</p>
        </a>
        <a href="/admin/audit-log" className="p-5 text-center bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
          <FiShield className="mx-auto text-2xl mb-2" />
          <span className="font-semibold">Audit Log</span>
          <p className="text-sm text-gray-200">Review sensitive system actions.</p>
        </a>
      </div>
      </div>
    </div>
  );
}
