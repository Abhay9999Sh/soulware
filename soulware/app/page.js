

"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const Home = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isLoaded) {
        if (!user) {
          // User not signed in, redirect to sign in
          router.push("/signin");
          return;
        }

        try {
          // Check user role in different collections
          const collections = [
            { name: 'student', endpoint: '/api/profile/student' },
            { name: 'counselor', endpoint: '/api/profile/counselor' },
            { name: 'volunteer', endpoint: '/api/profile/volunteer' },
            { name: 'admin', endpoint: '/api/profile/admin' }
          ];

          for (const collection of collections) {
            try {
              const res = await fetch(`${collection.endpoint}?userId=${user.id}`);
              if (res.ok) {
                const data = await res.json();
                if (data && data.userId) {
                  setUserRole(collection.name);
                  setLoading(false);
                  return;
                }
              }
            } catch (error) {
              console.error(`Error checking ${collection.name} profile:`, error);
            }
          }

          // If no profile found, redirect to onboarding
          console.log("No profile found, redirecting to onboarding");
          router.push("/onboarding");
        } catch (error) {
          console.error("Error checking user role:", error);
          setLoading(false);
        }
      }
    };

    checkUserRole();
  }, [user, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show welcome page for users with completed profiles
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Soulware</h1>
        <p className="text-gray-600 mb-8">Your mental health support platform</p>
        
        {userRole && (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Welcome back, <span className="font-semibold capitalize">{userRole}</span>!
            </p>
            
            <Link
              href={`/dashboard/${userRole}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Go to Dashboard
            </Link>
            
            {userRole === 'student' && (
              <div className="mt-4">
                <Link
                  href="/book-session"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Book New Session
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home
