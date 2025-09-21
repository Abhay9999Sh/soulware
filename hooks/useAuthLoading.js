"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, user } = useUser();
  const clerk = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && user) {
      // User is authenticated and loaded, show loading for redirect
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Give time for redirect

      return () => clearTimeout(timer);
    }
  }, [isLoaded, user]);

  return { isLoading, setIsLoading };
}