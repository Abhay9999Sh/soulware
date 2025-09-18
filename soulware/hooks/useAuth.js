"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthRedirect = (redirectTo = "/signin") => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(redirectTo);
    }
  }, [isLoaded, isSignedIn, router, redirectTo]);

  return { isLoaded, isSignedIn };
};

export const useAuthCheck = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  
  return {
    isLoaded,
    isSignedIn,
    user,
    isLoading: !isLoaded
  };
};
