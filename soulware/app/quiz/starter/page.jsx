"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Brain, Target, Sparkles, Check, Clock, Zap, Activity, Heart } from "lucide-react";
import { QUESTIONNAIRES, QUIZ_TYPES, calculateDomainScore, normalizeScore, calculateWellnessScore, flagHighRiskDomains } from "@/lib/questionnaires";

// A simple placeholder for your ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  // In a real app, this would check authentication status
  return <>{children}</>;
};


// --- Comprehensive Multi-Questionnaire Quiz Component ---

const ComprehensiveQuiz = ({ quizType, onComplete }) => {
  const questionnaires = quizType.questionnaires.map(id => ({ id, ...QUESTIONNAIRES[id] }));
  const allQuestions = [];
  const questionMap = [];
  
  // Build flat question list with mapping
  questionnaires.forEach((questionnaire, qIndex) => {
    questionnaire.questions.forEach((question, questionIndex) => {
      allQuestions.push({
        text: question,
        questionnaire: questionnaire.id,
        questionnaireIndex: qIndex,
        questionIndex,
        timeframe: questionnaire.timeframe,
        responseScale: questionnaire.responseScale
      });
      questionMap.push({ questionnaire: questionnaire.id, questionIndex });
    });
  });

  const [answers, setAnswers] = useState(Array(allQuestions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const calculateResults = (finalAnswers) => {
    // Group answers by questionnaire
    const answersByQuestionnaire = {};
    questionnaires.forEach(q => {
      answersByQuestionnaire[q.id] = [];
    });
    
    finalAnswers.forEach((answer, index) => {
      const mapping = questionMap[index];
      answersByQuestionnaire[mapping.questionnaire].push(answer || 0);
    });

    // Calculate domain scores
    const domainResults = questionnaires.map(q => 
      calculateDomainScore(q.id, answersByQuestionnaire[q.id])
    ).filter(Boolean);

    // Calculate overall wellness score
    const wellnessScore = calculateWellnessScore(domainResults);
    
    // Flag high-risk domains
    const flags = flagHighRiskDomains(domainResults);

    // Prepare detailed answers
    const detailedAnswers = allQuestions.map((q, i) => ({
      questionnaire: q.questionnaire,
      question: q.text,
      answer: finalAnswers[i]
    }));
    
    onComplete({
      domainResults,
      wellnessScore,
      flags,
      answers: detailedAnswers
    });
  };

  const handleAnswer = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < allQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults(newAnswers);
      }
    }, 300);
  };

  const currentQ = allQuestions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-600/50">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <motion.p 
            className="text-sm font-semibold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 px-4 py-2 rounded-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Question {currentQuestion + 1} of {allQuestions.length}
          </motion.p>
          <motion.div 
            className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-4 py-2 rounded-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {Math.round(((currentQuestion + 1) / allQuestions.length) * 100)}% Complete
          </motion.div>
        </div>
        <div className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full h-3 shadow-inner">
          <motion.div 
            className="bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 h-3 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / allQuestions.length) * 100}%`}}
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
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <motion.h2 
              className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {currentQ.timeframe}, how often have you experienced:
            </motion.h2>
            <motion.div 
              className="bg-gradient-to-r from-sky-100 via-pink-100 to-purple-100 dark:from-sky-900/30 dark:via-pink-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-200 italic">
                "{currentQ.text}"
              </p>
            </motion.div>
          </div>
          
          <div className="grid gap-4">
            {currentQ.responseScale.map((option, optionIndex) => (
              <motion.button
                key={optionIndex}
                onClick={() => handleAnswer(currentQuestion, option.value)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group ${
                  answers[currentQuestion] === option.value 
                    ? 'bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 border-transparent text-white font-semibold shadow-lg' 
                    : 'bg-white/70 dark:bg-gray-700/70 border-gray-200/50 dark:border-gray-600/50 hover:border-sky-300 dark:hover:border-sky-500 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + (optionIndex * 0.1) }}
              >
                <span className={`text-base md:text-lg ${
                  answers[currentQuestion] === option.value 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-200 group-hover:text-gray-800 dark:group-hover:text-white'
                }`}>
                  {option.label}
                </span>
                {answers[currentQuestion] === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                )}
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
  const searchParams = useSearchParams();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [showQuizSelection, setShowQuizSelection] = useState(true);
  const [returnTo, setReturnTo] = useState(null);

  // Get the return URL from query parameters safely
  useEffect(() => {
    if (searchParams) {
      setReturnTo(searchParams.get('returnTo'));
    }
  }, [searchParams]);

  const handleQuizComplete = async (quizResult) => {
    console.log("Quiz completed:", quizResult);
    
    try {
      // Send the comprehensive quiz result to backend
      const response = await fetch('/api/quiz/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizType: selectedQuizType.id,
          domainResults: quizResult.domainResults,
          wellnessScore: quizResult.wellnessScore,
          flags: quizResult.flags,
          answers: quizResult.answers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save quiz results');
      }

      setQuizCompleted(true);
      
      setTimeout(() => {
        const redirectUrl = returnTo || '/dashboard/student';
        window.location.href = redirectUrl; 
      }, 3000);

    } catch (error) {
      console.error("Error saving quiz result:", error);
      alert("There was a problem saving your results. Please try again.");
    }
  };

  if (quizCompleted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000 flex items-center justify-center p-4">
          {/* Dreamy Background Animations */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl opacity-20"
              style={{ top: '20%', left: '15%' }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-28 h-28 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl opacity-15"
              style={{ top: '70%', left: '80%' }}
              animate={{
                y: [0, -25, 0],
                x: [0, -15, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <motion.div
            className="text-center max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-gray-200/50 dark:border-gray-600/50 relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ 
                rotate: { duration: 3, ease: "easeInOut", repeat: Infinity },
                scale: { duration: 2, ease: "easeInOut", repeat: Infinity }
              }}
            >
              <Target className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome to Your{" "}
              <span className="bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Wellness Journey!
              </span>
              <motion.span 
                className="inline-block ml-4"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🎉
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your wellness assessment is complete! We're now creating a personalized dashboard 
              tailored specifically to your mental health journey.
            </motion.p>
            
            <motion.div 
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                  Personalizing your experience...
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This will only take a moment
              </p>
            </motion.div>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000 py-12 px-4">
        {/* Dreamy Background Animations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl opacity-20"
            style={{ top: '15%', left: '10%' }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-28 h-28 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl opacity-15"
            style={{ top: '60%', left: '85%' }}
            animate={{
              y: [0, -25, 0],
              x: [0, -15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full blur-xl opacity-10"
            style={{ top: '80%', left: '25%' }}
            animate={{
              y: [0, -20, 0],
              x: [0, 25, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl opacity-15"
            style={{ top: '35%', left: '5%' }}
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-36 h-36 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl opacity-10"
            style={{ top: '5%', left: '75%' }}
            animate={{
              y: [0, -35, 0],
              x: [0, 15, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.section 
          className="px-6 py-8 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto text-center mb-8">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Begin Your{" "}
                <span className="bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Wellness Journey
                </span>
                <motion.span 
                  className="inline-block ml-4" 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Welcome {user?.firstName}! Let's create a personalized mental wellness experience just for you. 
                This quick assessment will help us understand your needs better.
              </motion.p>
              <motion.div 
                className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div 
                  className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-gray-200/50 dark:border-gray-600/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Brain className="w-5 h-5 text-sky-500" /> 
                  <span className="text-gray-700 dark:text-gray-200 font-medium">Science-Based</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-gray-200/50 dark:border-gray-600/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Target className="w-5 h-5 text-pink-500" /> 
                  <span className="text-gray-700 dark:text-gray-200 font-medium">Personalized</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-gray-200/50 dark:border-gray-600/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="w-5 h-5 text-purple-500" /> 
                  <span className="text-gray-700 dark:text-gray-200 font-medium">5 Minutes</span>
                </motion.div>
              </motion.div>
          </div>
        </motion.section>

        {/* Quiz Selection Screen */}
        {showQuizSelection && (
          <motion.div 
            className="max-w-6xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Choose Your Assessment Type
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Select the assessment that best fits your time and needs. Both provide valuable insights into your mental wellness.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {Object.values(QUIZ_TYPES).map((quizType, index) => (
                <motion.div
                  key={quizType.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50 cursor-pointer group hover:shadow-3xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.2) }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => {
                    setSelectedQuizType(quizType);
                    setShowQuizSelection(false);
                  }}
                >
                  <div className="text-center">
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                        quizType.id === 'QUICK' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                      }`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {quizType.id === 'QUICK' ? (
                        <Zap className="w-10 h-10 text-white" />
                      ) : (
                        <Activity className="w-10 h-10 text-white" />
                      )}
                    </motion.div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                      {quizType.name}
                    </h3>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      {quizType.description}
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-5 h-5 text-sky-500" />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {quizType.duration}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2">
                        <Brain className="w-5 h-5 text-pink-500" />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {quizType.totalQuestions} questions
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="w-5 h-5 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {quizType.questionnaires.length} assessment{quizType.questionnaires.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <motion.button 
                      className={`w-full py-4 px-6 rounded-2xl font-semibold text-white text-lg transition-all duration-300 ${
                        quizType.id === 'QUICK'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start {quizType.name}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quiz Component */}
        {!showQuizSelection && selectedQuizType && (
          <div className="relative z-10">
            <ComprehensiveQuiz quizType={selectedQuizType} onComplete={handleQuizComplete} />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

// Loading component for Suspense fallback
const QuizLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
    </div>
  </div>
);

// Wrapper component with Suspense boundary
const StarterQuizPageWrapper = () => {
  return (
    <Suspense fallback={<QuizLoading />}>
      <StarterQuizPage />
    </Suspense>
  );
};

export default StarterQuizPageWrapper;

