"use client";
import React from "react";
import Link from "next/link";

const roles = [
	{ label: "Student", value: "student" },
	{ label: "Counselor", value: "counselor" },
	{ label: "Moderator/Volunteer", value: "volunteer" },
	{ label: "Admin", value: "admin" },
];

export default function Onboarding() {
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
