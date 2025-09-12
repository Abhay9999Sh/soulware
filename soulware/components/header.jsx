"use client"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";


const Header = () => {
  const { user } = useUser();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        try {
          // Try to fetch from different profile collections
          const collections = ['students', 'counselors', 'volunteers', 'admins'];
          for (const collection of collections) {
            const res = await fetch(`/api/profile/${collection.slice(0, -1)}?userId=${user.id}`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.userId) {
                setUserRole(collection.slice(0, -1));
                break;
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm py-2 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="font-bold text-xl text-gray-900 hover:text-primary transition-colors">
          Soulware
        </Link>
        <nav className="flex items-center gap-6">
          <SignedIn>
            {userRole && (
              <span className="text-sm text-gray-600 capitalize">
                {userRole}
              </span>
            )}
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "!w-10 !h-10",
                  userButtonPopoverCard: "shadow-xl ",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
};

export default Header;

//if user is signedout then show sigin button 
//and if user is signedin then show user button
