"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Heart, Zap, Activity, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, Target, Lightbulb, ArrowRight,
  BarChart3, PieChart, Calendar, Clock, RefreshCw, MessageCircle, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const WellnessDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);

  useEffect(() => {
    fetchWellnessDashboard();
  }, []);

  const fetchWellnessDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/quiz/wellness-dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch wellness dashboard');
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching wellness dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4"
          >
            <RefreshCw className="w-12 h-12 text-sky-500" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData?.hasCompletedAssessment) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Brain className="w-16 h-16 mx-auto mb-4 text-sky-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Complete Your Wellness Assessment
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Take our comprehensive mental health assessment to unlock your personalized wellness dashboard with insights and recommendations.
          </p>
          <Button 
            onClick={() => window.location.href = '/quiz/starter'}
            className="bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600"
          >
            Start Assessment
          </Button>
        </motion.div>
      </div>
    );
  }

  const { wellnessScore, interpretation, domainChart, flags, insights, recommendations, summary } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Your Wellness{" "}
          <span className="bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Comprehensive insights into your mental health and personalized recommendations
        </p>
      </motion.div>

      {/* Overall Wellness Score */}
      <motion.div 
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Overall Wellness Score</h2>
          <p className="text-gray-600 dark:text-gray-300">Based on your comprehensive assessment</p>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: wellnessScore / 100 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{
                  strokeDasharray: "251.2",
                  strokeDashoffset: `${251.2 - (wellnessScore / 100) * 251.2}`
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0EA5E9" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div 
                  className="text-4xl font-bold text-gray-800 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  {wellnessScore}
                </motion.div>
                <div className="text-sm text-gray-600 dark:text-gray-300">out of 100</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            interpretation?.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
            interpretation?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            interpretation?.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {interpretation?.level}
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{interpretation?.description}</p>
        </div>
      </motion.div>

      {/* Domain Scores Chart */}
      <motion.div 
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-sky-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Domain Breakdown</h2>
        </div>
        
        <div className="grid gap-4">
          {domainChart?.map((domain, index) => (
            <motion.div
              key={domain.domain}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => setSelectedDomain(selectedDomain === domain.domain ? null : domain.domain)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: domain.color }}
                  />
                  <span className="font-medium text-gray-800 dark:text-white capitalize">
                    {domain.domain}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    domain.severity === 'Severe' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    domain.severity === 'Moderate' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                    domain.severity === 'Mild' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {domain.severity}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800 dark:text-white">{domain.score}/100</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: domain.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${domain.score}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                />
              </div>
              
              <AnimatePresence>
                {selectedDomain === domain.domain && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {dashboardData.domainScores[domain.domain]?.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Flags and Alerts */}
      {flags && flags.length > 0 && (
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Areas Needing Attention</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {flags.map((flag, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800 dark:text-orange-300">{flag.issue}</h3>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-400 capitalize">
                  {flag.severity} level in {flag.domain}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Insights */}
      {insights && insights.length > 0 && (
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Personalized Insights</h2>
          </div>
          
          <div className="space-y-4">
            {insights.slice(0, 3).map((insight, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-2xl border ${
                  insight.type === 'positive' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                  insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                  insight.type === 'alert' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <div>
                    <h3 className={`font-semibold mb-1 ${
                      insight.type === 'positive' ? 'text-green-800 dark:text-green-300' :
                      insight.type === 'warning' ? 'text-yellow-800 dark:text-yellow-300' :
                      insight.type === 'alert' ? 'text-red-800 dark:text-red-300' :
                      'text-blue-800 dark:text-blue-300'
                    }`}>
                      {insight.title}
                    </h3>
                    <p className={`text-sm ${
                      insight.type === 'positive' ? 'text-green-700 dark:text-green-400' :
                      insight.type === 'warning' ? 'text-yellow-700 dark:text-yellow-400' :
                      insight.type === 'alert' ? 'text-red-700 dark:text-red-400' :
                      'text-blue-700 dark:text-blue-400'
                    }`}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-600/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Personalized Recommendations</h2>
          </div>
          
          <div className="space-y-6">
            {recommendations.slice(0, 3).map((rec, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-purple-50 dark:from-sky-900/20 dark:to-purple-900/20 border border-sky-200 dark:border-sky-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{rec.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{rec.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800 dark:text-white">Action Steps:</h4>
                  <ul className="space-y-1">
                    {rec.actions.slice(0, 3).map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <ArrowRight className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            onClick={() => window.location.href = '/quiz/starter'}
            className="bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
          <Button 
            onClick={() => window.location.href = '/counseling'}
            variant="outline"
            className="border-sky-300 text-sky-600 hover:bg-sky-50 dark:border-sky-600 dark:text-sky-400 dark:hover:bg-sky-900/20"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Talk to a Counselor
          </Button>
          <Button 
            onClick={() => window.location.href = '/library'}
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Explore Resources
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Assessment completed on {new Date(dashboardData.assessmentDate).toLocaleDateString()}
        </p>
      </motion.div>
    </div>
  );
};

export default WellnessDashboard;
