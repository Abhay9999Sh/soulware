"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function StudentProfileForm() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    enrollmentNo: "",
    year: "",
    branch: "",
    languagePref: "en",
    isAnonymous: false,
  });

  useEffect(() => {
    if (isLoaded && user) {
      console.log("Clerk user loaded:", user);
      setForm(prev => ({
        ...prev,
        name: user.fullName || "",
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
    console.log("Form submitted with data:", form);
    console.log("User from Clerk:", user);
    
    try {
      const formData = {
        ...form,
        userId: user?.id || "dummy_user_id"
      };
      
      console.log("Sending data to API:", formData);
      
      const res = await fetch("/api/profile/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      console.log("API Response status:", res.status);
      const data = await res.json();
      console.log("API Response data:", data);
      
      if (data.success) {
        alert("Profile saved successfully!");
        router.push("/"); // Redirect to home after successful save
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error: " + err.message);
    }
  };

  return (
    <form className="max-w-md mx-auto py-10 space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Student Profile</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-3 py-2" required />
      <input name="enrollmentNo" value={form.enrollmentNo} onChange={handleChange} placeholder="Enrollment No" className="w-full border rounded px-3 py-2" required />
      <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="w-full border rounded px-3 py-2" required />
      <input name="branch" value={form.branch} onChange={handleChange} placeholder="Branch" className="w-full border rounded px-3 py-2" required />
      <select name="languagePref" value={form.languagePref} onChange={handleChange} className="w-full border rounded px-3 py-2">
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="isAnonymous" checked={form.isAnonymous} onChange={handleChange} />
        Use Anonymous Mode
      </label>
      <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold">Save Profile</button>
    </form>
  );
}
