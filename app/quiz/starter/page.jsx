"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useUser } from "@clerk/nextjs"; // Using the real Clerk hook
import { Brain, Target, Sparkles, Check } from "lucide-react";

// A simple placeholder for your ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  // In a real app, this would check authentication status
  return <>{children}</>;
};


// --- A complete, self-contained PHQ-9 Quiz Component ---

const PHQ9Quiz = ({ onComplete }) => {
  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead or of hurting yourself in some way",
  ];

  const options = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const calculateResults = (finalAnswers) => {
    const totalScore = finalAnswers.reduce((sum, val) => sum + (val || 0), 0);
    let severity = "None";
    if (totalScore >= 20) severity = "Severe";
    else if (totalScore >= 15) severity = "Moderately Severe";
    else if (totalScore >= 10) severity = "Moderate";
    else if (totalScore >= 5) severity = "Mild";

    const detailedAnswers = questions.map((q, i) => ({
        question: q,
        answer: finalAnswers[i]
    }));
    
    onComplete({
      score: totalScore,
      severity: severity,
      answers: detailedAnswers
    });
  };

  const handleAnswer = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);

    // After an answer is selected, decide what to do next
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            // If it's not the last question, move to the next one
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // If it IS the last question, calculate and submit the results
            calculateResults(newAnswers);
        }
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
      <div className="mb-6">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Question {currentQuestion + 1} of {questions.length}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-6 min-h-[6rem]">
                Over the last 2 weeks, how often have you been bothered by: <br/> <span className="text-blue-600 dark:text-blue-400 italic">"{questions[currentQuestion]}"</span>
            </h2>
            <div className="space-y-3">
                {options.map((option, optionIndex) => (
                    <motion.button
                        key={optionIndex}
                        onClick={() => handleAnswer(currentQuestion, option.value)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${answers[currentQuestion] === option.value ? 'bg-blue-500 border-blue-600 text-white font-semibold' : 'bg-white/50 dark:bg-gray-800/50 border-transparent hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>{option.label}</span>
                        {answers[currentQuestion] === option.value && <Check className="w-5 h-5" />}
                    </motion.button>
                ))}
            </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


const StarterQuizPage = () => {
  const { user } = useUser();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = async (quizResult) => {
    console.log("Starter quiz completed:", quizResult);
    
    try {
      // Send the quiz result to your backend API route
      const response = await fetch('/api/quiz/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: quizResult.score,
          severity: quizResult.severity,
          answers: quizResult.answers,
          quizType: 'PHQ-9'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save quiz results');
      }

      setQuizCompleted(true);
      
      setTimeout(() => {
        // Redirect to a student-specific dashboard
        window.location.href = '/dashboard/student'; 
      }, 3000);

    } catch (error) {
      console.error("Error saving quiz result:", error);
      alert("There was a problem saving your results. Please try again.");
    }
  };

  if (quizCompleted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen gradient-hero dark:gradient-hero-dark flex items-center justify-center p-4">
          <motion.div
            className="text-center max-w-2xl mx-auto p-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
            >
              <Target className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Welcome to Your Wellness Journey! 🎉
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your starter assessment is complete. We&apos;re now personalizing your dashboard based on your responses.
            </p>
            
            <div className="flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mr-3"></div>
              <span className="text-gray-600 dark:text-gray-300">Redirecting to your personalized dashboard...</span>
            </div>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-hero dark:gradient-hero-dark transition-all duration-500 py-12 px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-xl"
            animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <motion.section 
          className="px-6 py-8 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto text-center mb-8">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
              >
                Welcome{" "}
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {user?.firstName || "to Soulware"}
                </span>
                <motion.span className="inline-block ml-4" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>🌟</motion.span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
              >
                Let&apos;s start your wellness journey with a quick assessment. This will help us personalize your experience.
              </motion.p>
              <motion.div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2"><Brain className="w-5 h-5 text-blue-500" /> <span className="text-gray-700 dark:text-gray-200 font-medium">Science-Based</span></div>
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2"><Target className="w-5 h-5 text-green-500" /> <span className="text-gray-700 dark:text-gray-200 font-medium">Personalized</span></div>
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2"><Sparkles className="w-5 h-5 text-purple-500" /> <span className="text-gray-700 dark:text-gray-200 font-medium">5 Minutes</span></div>
              </motion.div>
          </div>
        </motion.section>

        <div className="relative z-10">
          <PHQ9Quiz onComplete={handleQuizComplete} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StarterQuizPage;

