"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

const AuthButton = ({ 
  children, 
  href, 
  isProtected = false, 
  className = "", 
  size = "default",
  variant = "default",
  ...props 
}) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    
    if (isProtected && !isSignedIn) {
      // Redirect to sign-in page if trying to access protected route
      router.push("/sign-in");
      return;
    }
    
    if (href) {
      setIsLoading(true);
      // Add a small delay for better UX
      setTimeout(() => {
        router.push(href);
        setIsLoading(false);
      }, 150);
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
