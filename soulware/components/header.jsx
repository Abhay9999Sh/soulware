"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Menu,
  X,
  User,
  Home,
  Info,
  BookOpen,
  MessageCircle,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { isLoaded, user } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetch("/api/users/me")
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setDbUser(data);
          }
        })
        .catch((err) => console.error("Failed to fetch DB user:", err));
    }
  }, [isLoaded, user]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg py-4 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center font-bold text-xl sm:text-2xl text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            onClick={closeMobileMenu}
          >
            <Image src="/logo.png" alt="Soulware Logo" width={50} height={50} />
            <span className="ml-[15px] text-blue-600 dark:text-blue-400">
              Soul
            </span>
            ware
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                About
              </Link>
              <Link
                href="/library"
                className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                Library
              </Link>
              <SignedIn>
                {dbUser?.role === "student" && (
                    <>
                      <Link
                        href="/counseling"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
                      >
                        Counseling
                      </Link>
                      <Link
                        href="/community"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
                      >
                        Community
                      </Link>
                    </>
                  )}

              </SignedIn>
            </div>
            <SignedIn>
              {dbUser?.role && (
                <Link
                  href={`/dashboard/${dbUser.role}`}
                  className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium mr-4"
                >
                  Dashboard
                </Link>
              )}
            </SignedIn>
            <ThemeToggle />
            <LanguageSwitcher />
            <SignedIn>
              
              {dbUser?.role && (
                <span className="text-sm text-gray-800 dark:text-gray-200 capitalize bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full font-medium">
                  {dbUser.role}
                </span>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "!w-10 !h-10 !rounded-xl",
                    userButtonPopoverCard:
                      "shadow-xl rounded-xl border border-gray-100",
                    userPreviewMainIdentifier: "font-semibold",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button
                  variant="outline"
                  className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-xl px-4 py-2 transition-all duration-300"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-2xl z-50 lg:hidden border-l border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-black dark:text-white">
                    Menu
                  </h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info (if signed in) */}
                <SignedIn>
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-black dark:text-white">
                          {user?.firstName || "User"}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 capitalize">
                          {dbUser?.role || "Member"}
                        </p>
                      </div>
                    </div>
                  </div>
                </SignedIn>

                {/* Navigation Links */}
                <nav className="flex-1 p-6">
                  <div className="space-y-2">
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <Home className="w-5 h-5" />
                      Home
                    </Link>

                    <Link
                      href="/about"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <Info className="w-5 h-5" />
                      About
                    </Link>

                    <Link
                      href="/library"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <BookOpen className="w-5 h-5" />
                      Library
                    </Link>

                    <SignedIn>
                      {dbUser?.role === "student" && (
                        <>
                          <Link
                            href="/counseling"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          >
                            <MessageCircle className="w-5 h-5" />
                            Counseling
                          </Link>

                          <Link
                            href="/community"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          >
                            <MessageCircle className="w-5 h-5" />
                            COmmunity
                          </Link>
                        </>
                      )}
                      {dbUser?.role && (
                        <Link
                          href={`/dashboard/${dbUser.role}`}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          Dashboard
                        </Link>
                      )}
                    </SignedIn>
                  </div>
                </nav>

                {/* Sign In Button (if signed out) */}
                <SignedOut>
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <SignInButton>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-xl py-3 transition-all duration-300"
                        onClick={closeMobileMenu}
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                  </div>
                </SignedOut>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
