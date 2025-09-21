"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Save, X, Loader } from "lucide-react";

export default function NewVolunteerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    areas: "", // Storing as a comma-separated string for easy input
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            // Convert comma-separated string to an array of trimmed strings
            areas: formData.areas.split(',').map(area => area.trim()).filter(Boolean),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to create volunteer.");
      }
      
      alert("Volunteer invitation sent successfully!");
      router.push("/dashboard/admin"); // Redirect back to the dashboard after success

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold">Add New Volunteer</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input type="text" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label className="block font-medium mb-1">Email Address (for invitation)</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label className="block font-medium mb-1">Areas of Support</label>
          <input type="text" value={formData.areas} onChange={e => setFormData({...formData, areas: e.target.value})} placeholder="e.g., Exam Stress, Anxiety, Relationships" required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-green-500 focus:border-green-500" />
           <p className="text-xs text-gray-500 mt-1">Separate areas with a comma.</p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition">
            <X size={18} /> Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 w-40 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
            {isSubmitting ? <Loader className="animate-spin" /> : <><Save size={18} /> Save Volunteer</>}
          </button>
        </div>
      </form>
    </div>
  );
}