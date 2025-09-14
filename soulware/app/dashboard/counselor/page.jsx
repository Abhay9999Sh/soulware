"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiUserCheck, FiLoader } from "react-icons/fi";

const GradientCard = ({ icon: Icon, title, value, color, action }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    onClick={action}
    className={`cursor-pointer p-6 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white flex flex-col justify-between`}
  >
    <div className="flex items-center gap-3">
      <Icon className="text-3xl opacity-90" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    {value && <p className="text-3xl font-bold mt-4">{value}</p>}
  </motion.div>
);

export default function CounselorDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      async function fetchData() {
        try {
          const res = await fetch("/api/appointments/counselor");
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

  const quickActions = [
    {
      title: "Edit Profile",
      description: "Update your bio and qualifications.",
      icon: FiUserCheck,
      color: "from-blue-500 to-blue-600",
      action: () => alert("Redirect to profile edit page"),
    },
    {
      title: "Manage Schedule",
      description: "Set availability for student appointments.",
      icon: FiClock,
      color: "from-green-500 to-green-600",
      action: () => alert("Redirect to schedule page"),
    },
  ];

  return (
    <div className="p-6 space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Counselor Dashboard 🌟
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          You’re making an impact every day. Keep guiding students towards their
          goals with focus and care!
        </p>
      </motion.section>

      {/* Quick Action Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((item, i) => (
          <GradientCard
            key={i}
            icon={item.icon}
            title={item.title}
            color={item.color}
            action={item.action}
          />
        ))}
      </section>

      {/* Upcoming Appointments */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FiCalendar /> Upcoming Appointments
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          {appointments.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {appointments.map((appt) => (
                <li
                  key={appt._id}
                  className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {appt.studentName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(appt.scheduledFor).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        appt.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appt.status}
                    </span>
                    <button className="text-blue-600 hover:underline text-sm">
                      View Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-gray-500 dark:text-gray-300">
              No upcoming appointments.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
