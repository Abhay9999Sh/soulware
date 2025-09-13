"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const Header = () => {
  // isLoaded and user come from Clerk's hook
  const { isLoaded, user } = useUser();
  // We'll store our database user profile here
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    // This effect runs when the Clerk user is loaded or changes
    if (isLoaded && user) {
      // Fetch our user profile from the database
      fetch('/api/users/me')
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setDbUser(data);
          }
        })
        .catch(err => console.error("Failed to fetch DB user:", err));
    }
  }, [isLoaded, user]); // Dependency array ensures this runs at the right time

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm py-2 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="font-bold text-xl text-gray-900 hover:text-primary transition-colors">
          Soulware
        </Link>
        <nav className="flex items-center gap-4">
          {/* This block shows only when a user is signed IN */}
          <SignedIn>
            {/* Show the user's role from our database if it exists */}
            {dbUser?.role && (
              <Link
                href={`/dashboard/${dbUser.role}`}
                className="text-sm font-medium text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition"
              >
                Dashboard
              </Link>
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "!w-10 !h-10",
                },
              }}
            />
          </SignedIn>

          {/* This block shows only when a user is signed OUT */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
};

export default Header;