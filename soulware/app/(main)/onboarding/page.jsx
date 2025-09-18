"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs"; 
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function checkUser() {
      try {
        // Check if this Clerk user already exists in MongoDB
        const res = await fetch(`/api/users?clerkId=${user.id}`);
        const data = await res.json();

        if (data?.clerkId && data?.role) {
          // Existing user - redirect to their dashboard immediately
          if (data.role === "student") router.push("/dashboard/student");
          if (data.role === "counselor") router.push("/dashboard/counselor");
          if (data.role === "volunteer") router.push("/dashboard/volunteer");
          if (data.role === "admin") router.push("/dashboard/admin");
        } else {
          // New user (no record found) → show onboarding
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking user:", err);
        // On error, show onboarding to be safe
        setLoading(false);
      }
    }

    checkUser();
  }, [user, router]);

  if (loading) {
    return <p className="text-center mt-10">Checking account...</p>;
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Role</h2>
      <div className="grid gap-4">
        <Link
          href="/profile/student"
          className="block w-full py-3 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-center font-medium shadow-sm transition"
        >
          📚 Student
        </Link>
        <Link
          href="/profile/counselor"
          className="block w-full py-3 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-center font-medium shadow-sm transition"
        >
          🧠 Counselor
        </Link>
      </div>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Volunteers and Admins are added by the system administrator.
      </p>
    </div>
  );
}
