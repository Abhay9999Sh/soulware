"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = [
	{ label: "Student", value: "student" },
	{ label: "Counselor", value: "counselor" },
	{ label: "Moderator/Volunteer", value: "volunteer" },
	{ label: "Admin", value: "admin" },
];

export default function Onboarding() {
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [hasProfile, setHasProfile] = useState(false);

	useEffect(() => {
		const checkExistingProfile = async () => {
			if (!isLoaded) return;

			if (!user) {
				// User not signed in, redirect to sign in
				router.push("/signin");
				return;
			}

			try {
				console.log("Checking for existing profiles for user:", user.id);
				
				// Check all profile types to see if user already has a completed profile
				const profileChecks = roles.map(async (role) => {
					try {
						const res = await fetch(`/api/profile/${role.value}?userId=${user.id}`);
						if (res.ok) {
							const data = await res.json();
							if (data && data.userId) {
								console.log(`Found existing ${role.value} profile`);
								return { role: role.value, exists: true };
							}
						}
					} catch (error) {
						console.error(`Error checking ${role.value} profile:`, error);
					}
					return { role: role.value, exists: false };
				});

				const results = await Promise.all(profileChecks);
				const existingProfile = results.find(result => result.exists);

				if (existingProfile) {
					console.log(`User already has ${existingProfile.role} profile, redirecting to home`);
					setHasProfile(true);
					router.push("/");
					return;
				}

				console.log("No existing profile found, allowing onboarding");
				setLoading(false);
			} catch (error) {
				console.error("Error checking existing profiles:", error);
				setLoading(false);
			}
		};

		checkExistingProfile();
	}, [user, isLoaded, router]);

	// Show loading while checking profiles
	if (!isLoaded || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Checking your profile...</p>
				</div>
			</div>
		);
	}

	// Don't render onboarding if user already has a profile
	if (hasProfile) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600">Redirecting to your dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto py-10">
			<h2 className="text-2xl font-bold mb-6 text-center">Choose Your Role</h2>
			<div className="grid gap-4">
				{roles.map((role) => (
					<Link
						key={role.value}
						href={`/profile/${role.value}`}
						className="block w-full py-3 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-center font-medium shadow-sm transition"
					>
						{role.label}
					</Link>
				))}
			</div>
		</div>
	);
}
