"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CounselorProfile() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    specialization: "",
    qualification: "PhD in Clinical Psychology",
    languages: ["English"],
    bio: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    try {
      // First create user record
      const userResponse = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          email: formData.email,
          role: "counselor",
          isOnboarded: true,
          profile: {
            name: formData.name,
            displayName: formData.name,
          },
        }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to create user record");
      }

      // Then create counselor profile
      const counselorResponse = await fetch("/api/profile/counselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });

      if (!counselorResponse.ok) {
        throw new Error("Failed to create counselor profile");
      }

      // Redirect to counselor dashboard
      router.push("/dashboard/counselor");
    } catch (error) {
      console.error("Error creating counselor profile:", error);
      alert("Error creating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (value) => {
    const languages = value.split(",").map(lang => lang.trim());
    setFormData({ ...formData, languages });
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Counselor Profile</CardTitle>
          <p className="text-sm text-gray-600">
            Please provide your professional details. Your profile will be reviewed by an administrator before being activated.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Specialization</label>
              <Input
                type="text"
                placeholder="e.g., Anxiety, Depression, Academic Stress"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Qualification</label>
              <Input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Languages (comma separated)</label>
              <Input
                type="text"
                placeholder="e.g., English, Hindi, Spanish"
                value={formData.languages.join(", ")}
                onChange={(e) => handleLanguageChange(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Professional Bio</label>
              <Textarea
                placeholder="Tell students about your experience, approach, and specialties..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Your profile will be reviewed by an administrator before students can see it. 
                You'll receive an email once your profile is approved.
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Profile..." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}