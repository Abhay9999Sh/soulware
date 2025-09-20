"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Heart, 
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  Target,
  Award,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PHQ9Quiz = ({ onComplete, isStarterQuiz = false, userId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(Array(9).fill(null));
  const [functionalImpairment, setFunctionalImpairment] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [wellnessLevel, setWellnessLevel] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PHQ-9 Questions based on the provided PDF
  const questions = [
    {
      id: 1,
      text: "Little interest or pleasure in doing things",
      category: "anhedonia"
    },
    {
      id: 2,
      text: "Feeling down, depressed, or hopeless",
      category: "mood"
    },
    {
      id: 3,
      text: "Trouble falling or staying asleep, or sleeping too much",
      category: "sleep"
    },
    {
      id: 4,
      text: "Feeling tired or having little energy",
      category: "energy"
    },
    {
      id: 5,
      text: "Poor appetite or overeating",
      category: "appetite"
    },
    {
      id: 6,
      text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
      category: "self-worth"
    },
    {
      id: 7,
      text: "Trouble concentrating on things, such as reading the newspaper or watching television",
      category: "concentration"
    },
    {
      id: 8,
      text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
      category: "psychomotor"
    },
    {
      id: 9,
      text: "Thoughts that you would be better off dead or of hurting yourself in some way",
      category: "suicidal"
    }
  ];

  const responseOptions = [
    { value: 0, label: "Not at all", color: "text-green-600", bgColor: "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30" },
    { value: 1, label: "Several days", color: "text-yellow-600", bgColor: "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30" },
    { value: 2, label: "More than half the days", color: "text-orange-600", bgColor: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30" },
    { value: 3, label: "Nearly every day", color: "text-red-600", bgColor: "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30" }
  ];

  const functionalImpairmentOptions = [
    { value: 0, label: "Not difficult at all", color: "text-green-600" },
    { value: 1, label: "Somewhat difficult", color: "text-yellow-600" },
    { value: 2, label: "Very difficult", color: "text-orange-600" },
    { value: 3, label: "Extremely difficult", color: "text-red-600" }
  ];

  const calculateScore = () => {
    const totalScore = responses.reduce((sum, response) => sum + (response || 0), 0);
    setScore(totalScore);
    return totalScore;
  };

  const getWellnessLevel = (score) => {
    if (score >= 0 && score <= 4) return "minimal";
    if (score >= 5 && score <= 9) return "mild";
    if (score >= 10 && score <= 14) return "moderate";
    if (score >= 15 && score <= 19) return "moderately-severe";
    if (score >= 20 && score <= 27) return "severe";
    return "unknown";
  };

  const getRecommendations = (score, level) => {
    const baseRecommendations = {
      minimal: [
        "Continue with your current self-care practices",
        "Maintain regular exercise and healthy sleep habits",
        "Consider mindfulness or meditation practices",
        "Stay connected with friends and family"
      ],
      mild: [
        "Consider talking to a counselor or therapist",
        "Increase physical activity and outdoor time",
        "Practice stress management techniques",
        "Monitor your mood and symptoms regularly",
        "Maintain social connections and activities you enjoy"
      ],
      moderate: [
        "Strongly consider professional counseling or therapy",
        "Discuss with a healthcare provider about treatment options",
        "Implement structured daily routines",
        "Consider joining a support group",
        "Focus on sleep hygiene and regular exercise"
      ],
      "moderately-severe": [
        "Seek professional help from a mental health provider",
        "Consider both therapy and medication evaluation",
        "Develop a safety plan with trusted individuals",
        "Maintain regular contact with healthcare providers",
        "Consider intensive outpatient programs if available"
      ],
      severe: [
        "Seek immediate professional help",
        "Contact a mental health crisis line if needed",
        "Consider inpatient or intensive treatment programs",
        "Develop a comprehensive safety plan",
        "Ensure regular monitoring by healthcare professionals"
      ]
    };

    // Add crisis resources for high scores or suicidal ideation
    if (score >= 15 || responses[8] > 0) {
      return [
        ...baseRecommendations[level],
        "Crisis resources: National Suicide Prevention Lifeline: 988",
        "Crisis Text Line: Text HOME to 741741",
        "If in immediate danger, call 911"
      ];
    }

    return baseRecommendations[level] || [];
  };

  const handleResponseSelect = (value) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Move to functional impairment question
      setCurrentQuestion(questions.length);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const finalScore = calculateScore();
    const level = getWellnessLevel(finalScore);
    const recs = getRecommendations(finalScore, level);
    
    setWellnessLevel(level);
    setRecommendations(recs);
    setIsCompleted(true);
    setShowResults(true);

    // Save quiz results (you'll implement the API call)
    try {
      const quizResult = {
        userId,
        quizType: isStarterQuiz ? "starter" : "weekly",
        score: finalScore,
        wellnessLevel: level,
        responses,
        functionalImpairment,
        recommendations: recs,
        completedAt: new Date(),
        isStarterQuiz
      };

      // TODO: Implement API call to save quiz results
      console.log("Quiz result:", quizResult);
      
      if (onComplete) {
        onComplete(quizResult);
      }
    } catch (error) {
      console.error("Error saving quiz results:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setResponses(Array(9).fill(null));
    setFunctionalImpairment(null);
    setIsCompleted(false);
    setScore(0);
    setWellnessLevel("");
    setRecommendations([]);
    setShowResults(false);
  };

  const progress = ((currentQuestion + 1) / (questions.length + 1)) * 100;
  const canProceed = currentQuestion < questions.length ? 
    responses[currentQuestion] !== null : 
    functionalImpairment !== null;

  if (showResults) {
    return (
      <motion.div
        className="max-w-4xl mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {isStarterQuiz ? "Starter Assessment Complete!" : "Weekly Check-in Complete!"}
            </h2>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Score</div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className={`text-2xl font-bold capitalize ${
                  wellnessLevel === 'minimal' ? 'text-green-600' :
                  wellnessLevel === 'mild' ? 'text-yellow-600' :
                  wellnessLevel === 'moderate' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {wellnessLevel}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Wellness Level</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Personalized Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  className="flex items-start p-4 glass rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Star className="w-4 h-4 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-200">{rec}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={resetQuiz}
              variant="outline"
              className="glass border-0 hover:bg-white/20 dark:hover:bg-gray-800/20 px-6 py-3"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Again
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3"
            >
              <Target className="w-4 h-4 mr-2" />
              View Dashboard
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {isStarterQuiz ? "Starter Mental Health Assessment" : "Weekly Wellness Check-in"}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {isStarterQuiz 
              ? "This assessment will help us understand your current mental health status and create a personalized wellness plan for you."
              : "Let's check in on how you've been feeling this week. Your responses help us track your progress and provide better support."
            }
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Question {currentQuestion + 1} of {questions.length + 1}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Question Content */}
        <AnimatePresence mode="wait">
          {currentQuestion < questions.length ? (
            <motion.div
              key={currentQuestion}
              className="mb-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  Over the last 2 weeks, how often have you been bothered by:
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">
                  {questions[currentQuestion].text}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {responseOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleResponseSelect(option.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      responses[currentQuestion] === option.value
                        ? `border-blue-500 ${option.bgColor} ring-2 ring-blue-200 dark:ring-blue-800`
                        : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${option.bgColor}`
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * option.value }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-semibold ${option.color} mb-1`}>
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Score: {option.value}
                        </div>
                      </div>
                      {responses[currentQuestion] === option.value && (
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="functional-impairment"
              className="mb-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  Functional Impact Assessment
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">
                  If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {functionalImpairmentOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => setFunctionalImpairment(option.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      functionalImpairment === option.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * option.value }}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`font-semibold ${option.color}`}>
                        {option.label}
                      </div>
                      {functionalImpairment === option.value && (
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="glass border-0 hover:bg-white/20 dark:hover:bg-gray-800/20 px-6 py-3 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestion < questions.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 disabled:opacity-50"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Complete Assessment
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </motion.div>

        {/* Crisis Warning */}
        {responses[8] > 0 && (
          <motion.div
            className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Immediate Support Available
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  We noticed you may be having thoughts of self-harm. Please know that help is available and you don't have to face this alone.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-red-700 dark:text-red-300">
                    <strong>Crisis Resources:</strong>
                  </p>
                  <p className="text-red-700 dark:text-red-300">
                    • National Suicide Prevention Lifeline: <strong>988</strong>
                  </p>
                  <p className="text-red-700 dark:text-red-300">
                    • Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong>
                  </p>
                  <p className="text-red-700 dark:text-red-300">
                    • Emergency Services: <strong>911</strong>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PHQ9Quiz;
