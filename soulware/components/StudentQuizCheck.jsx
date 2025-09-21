"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function StudentQuizCheck({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    async function checkQuizStatus() {
      try {
        // First check if user is a student
        const userRes = await fetch('/api/users/me');
        const userData = await userRes.json();
        
        if (userData.role !== 'student') {
          // Not a student, allow access
          setIsStudent(false);
          setLoading(false);
          return;
        }

        setIsStudent(true);

        // Check if student has completed quiz
        const quizRes = await fetch('/api/quiz/score');
        const quizData = await quizRes.json();
        
        if (quizData?.score !== null && quizData?.score !== undefined) {
          // Quiz completed, allow access
          setHasCompletedQuiz(true);
          setLoading(false);
        } else {
          // Quiz not completed, redirect to starter quiz
          const currentPath = window.location.pathname;
          router.push(`/quiz/starter?returnTo=${encodeURIComponent(currentPath)}`);
        }
      } catch (error) {
        console.error('Error checking quiz status:', error);
        setLoading(false);
      }
    }

    checkQuizStatus();
  }, [user, isLoaded, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">
            Checking your progress...
          </p>
        </div>
      </div>
    );
  }

  // If not a student or has completed quiz, render children
  if (!isStudent || hasCompletedQuiz) {
    return children;
  }

  // This should not be reached as we redirect above, but just in case
  return null;
}
