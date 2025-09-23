"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const useAuthRedirect = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Force full page reload on authentication state changes
    if (isLoaded) {
      // If user just signed in, force a full page reload to ensure proper state
      if (isSignedIn && user) {
        // Use window.location.href for full page reload instead of router.push
        const currentPath = window.location.pathname;
        
        // If we're on the sign-in page and user is authenticated, redirect with full reload
        if (currentPath.includes('/signin') || currentPath.includes('/signup')) {
          window.location.href = '/onboarding';
          return;
        }
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  return { isLoaded, isSignedIn, user };
};

export default useAuthRedirect;
