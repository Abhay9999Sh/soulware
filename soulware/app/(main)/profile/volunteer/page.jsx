"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function VolunteerProfileForm() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "peer-volunteer",
    trained: false,
    assignedSections: "",
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...form,
        userId: user?.id || "dummy_volunteer_id"
      };
      
      const res = await fetch("/api/profile/volunteer", {
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
      <h2 className="text-xl font-bold mb-4">Volunteer/Moderator Profile</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-3 py-2" required />
      <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2">
        <option value="peer-volunteer">Peer Volunteer</option>
        <option value="forum-moderator">Forum Moderator</option>
      </select>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="trained" checked={form.trained} onChange={handleChange} />
        Officially Trained
      </label>
      <input name="assignedSections" value={form.assignedSections} onChange={handleChange} placeholder="Assigned Sections (comma separated)" className="w-full border rounded px-3 py-2" />
      <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold">Save Profile</button>
    </form>
  );
}
