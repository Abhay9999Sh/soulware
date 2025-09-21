"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const AuthButton = ({ 
  children, 
  href, 
  isProtected = false, 
  isDashboardRoute = false,
  className = "", 
  size = "default",
  variant = "default",
  ...props 
}) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  // Fetch user role from database
  useEffect(() => {
    if (isSignedIn && user && isDashboardRoute) {
      fetch("/api/users/me")
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setDbUser(data);
          }
        })
        .catch((err) => console.error("Failed to fetch DB user:", err));
    }
  }, [isSignedIn, user, isDashboardRoute]);

  const handleClick = async (e) => {
    e.preventDefault();
    
    if (isProtected && !isSignedIn) {
      // Redirect to Clerk sign-in page if trying to access protected route
      console.log("Redirecting to sign-in page...");
      router.push("/signin");
      return;
    }
    
    setIsLoading(true);
    
    // Handle dashboard routing based on user role
    if (isDashboardRoute && isSignedIn) {
      if (dbUser?.role) {
        // Route to role-specific dashboard
        setTimeout(() => {
          router.push(`/dashboard/${dbUser.role}`);
          setIsLoading(false);
        }, 150);
      } else {
        // If role not loaded yet, wait a bit and try again
        setTimeout(() => {
          if (dbUser?.role) {
            router.push(`/dashboard/${dbUser.role}`);
          } else {
            // Fallback to general dashboard if role can't be determined
            router.push("/dashboard");
          }
          setIsLoading(false);
        }, 500);
      }
    } else if (href) {
      // Regular href routing
      setTimeout(() => {
        router.push(href);
        setIsLoading(false);
      }, 150);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      size={size}
      variant={variant}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Loading...
        </motion.div>
      ) : (
        children
      )}
    </Button>
  );
};

export default AuthButton;
