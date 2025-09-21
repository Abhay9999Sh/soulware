"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Save, X, Loader } from "lucide-react";

export default function NewCounselorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    qualification: "",
    languages: "", // Storing as comma-separated string for easy input
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/counselors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            // Convert comma-separated string to an array of trimmed strings
            languages: formData.languages.split(',').map(lang => lang.trim()).filter(Boolean),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to create counselor.");
      }
      
      alert("Counselor invitation sent successfully!");
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
        <UserPlus className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Add New Counselor</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input type="text" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block font-medium mb-1">Email Address (for invitation)</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block font-medium mb-1">Qualification</label>
          <input type="text" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} placeholder="e.g., Licensed Professional Counselor" required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block font-medium mb-1">Languages Spoken</label>
          <input type="text" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} placeholder="e.g., English, Spanish, Hindi" required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
           <p className="text-xs text-gray-500 mt-1">Separate languages with a comma.</p>
        </div>
        <div>
          <label className="block font-medium mb-1">Short Bio</label>
          <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows="3" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition">
            <X size={18} /> Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 w-40 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {isSubmitting ? <Loader className="animate-spin" /> : <><Save size={18} /> Save Counselor</>}
          </button>
        </div>
      </form>
    </div>
  );
}