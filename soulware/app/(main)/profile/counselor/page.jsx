"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CounselorProfileForm() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    specialization: "",
    availableSlots: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      setForm(prev => ({
        ...prev,
        email: user.emailAddresses?.[0]?.emailAddress || "",
      }));
    }
  }, [isLoaded, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...form,
        userId: user?.id || "dummy_counselor_id"
      };
      
      const res = await fetch("/api/profile/counselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Profile saved successfully!");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <form className="max-w-md mx-auto py-10 space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Counselor Profile</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-3 py-2" required />
      <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="w-full border rounded px-3 py-2" required />
      <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" className="w-full border rounded px-3 py-2" required />
      <input name="availableSlots" value={form.availableSlots} onChange={handleChange} placeholder="Available Slots (comma separated dates)" className="w-full border rounded px-3 py-2" />
      <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold">Save Profile</button>
    </form>
  );
}
