"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Wind, 
  Heart, 
  Brain, 
  Zap, 
  Target, 
  Gamepad2,
  Play,
  Clock,
  Users,
  Star
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const GameCard = ({ game, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'coming-soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'beta':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-600/50 cursor-pointer transition-all duration-300 ${
        game.status === 'available' ? 'hover:shadow-2xl hover:scale-105' : 'opacity-75'
      }`}
      whileHover={game.status === 'available' ? { scale: 1.02 } : {}}
      whileTap={game.status === 'available' ? { scale: 0.98 } : {}}
      onClick={game.status === 'available' ? onClick : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center`}>
          <game.icon className="w-8 h-8 text-white" />
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(game.status)}`}>
          {game.status === 'available' ? 'Play Now' : game.status === 'coming-soon' ? 'Coming Soon' : 'Beta'}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{game.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{game.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{game.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          <span>{game.rating}/5</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {game.tags.map((tag, index) => (
          <span key={index} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {game.status === 'available' && (
        <div className="flex items-center justify-center">
          <div className={`flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${game.gradient} text-white px-4 py-2 rounded-full`}>
            <Play className="w-4 h-4" />
            Start Game
          </div>
        </div>
      )}
    </motion.div>
  );
};

const GamesPage = () => {
  const router = useRouter();

  const games = [
    {
      id: 'calming-breath',
      title: 'Calming Breath',
      description: 'Practice scientifically-proven breathing techniques to reduce stress and anxiety. Follow the 4-7-8 breathing cycle with beautiful visuals and calming sounds.',
      icon: Wind,
      gradient: 'from-sky-400 to-blue-600',
      status: 'available',
      duration: '5-15 min',
      difficulty: 'Beginner',
      rating: 4.9,
      tags: ['Breathing', 'Relaxation', 'Stress Relief', 'Mindfulness'],
      route: '/games/calming-breath'
    },
    {
      id: 'mindful-meditation',
      title: 'Mindful Meditation',
      description: 'Guided meditation sessions with ambient sounds and visual cues to help you achieve deep relaxation and mental clarity.',
      icon: Brain,
      gradient: 'from-purple-400 to-pink-600',
      status: 'coming-soon',
      duration: '10-30 min',
      difficulty: 'All Levels',
      rating: 4.8,
      tags: ['Meditation', 'Mindfulness', 'Focus', 'Calm'],
      route: '/games/meditation'
    },
    {
      id: 'mood-booster',
      title: 'Mood Booster',
      description: 'Interactive activities and positive affirmations designed to lift your spirits and improve your emotional well-being.',
      icon: Heart,
      gradient: 'from-pink-400 to-red-500',
      status: 'coming-soon',
      duration: '3-10 min',
      difficulty: 'Easy',
      rating: 4.7,
      tags: ['Mood', 'Positivity', 'Affirmations', 'Joy'],
      route: '/games/mood-booster'
    },
    {
      id: 'focus-trainer',
      title: 'Focus Trainer',
      description: 'Cognitive exercises and attention training games to improve concentration, memory, and mental sharpness.',
      icon: Target,
      gradient: 'from-green-400 to-emerald-600',
      status: 'coming-soon',
      duration: '5-20 min',
      difficulty: 'Intermediate',
      rating: 4.6,
      tags: ['Focus', 'Concentration', 'Cognitive', 'Training'],
      route: '/games/focus-trainer'
    },
    {
      id: 'energy-boost',
      title: 'Energy Boost',
      description: 'Quick energizing exercises and movements to combat fatigue and increase your vitality throughout the day.',
      icon: Zap,
      gradient: 'from-yellow-400 to-orange-500',
      status: 'coming-soon',
      duration: '2-8 min',
      difficulty: 'Easy',
      rating: 4.5,
      tags: ['Energy', 'Movement', 'Vitality', 'Quick'],
      route: '/games/energy-boost'
    },
    {
      id: 'sleep-helper',
      title: 'Sleep Helper',
      description: 'Relaxing bedtime routines, sleep stories, and calming sounds to help you achieve better quality sleep.',
      icon: Heart,
      gradient: 'from-indigo-400 to-purple-600',
      status: 'coming-soon',
      duration: '10-45 min',
      difficulty: 'Beginner',
      rating: 4.8,
      tags: ['Sleep', 'Relaxation', 'Bedtime', 'Rest'],
      route: '/games/sleep-helper'
    }
  ];

  const handleGameClick = (game) => {
    if (game.status === 'available') {
      router.push(game.route);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-xl"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-24 h-24 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl"
            animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/3 w-28 h-28 bg-pink-200/20 dark:bg-pink-800/20 rounded-full blur-xl"
            animate={{ y: [0, -15, 0], x: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <div className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Gamepad2 className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Games & Exercises
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Interactive wellness activities designed to improve your mental health through engaging games, 
                breathing exercises, and mindfulness practices.
              </p>
            </motion.div>

            {/* Games Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GameCard 
                    game={game} 
                    onClick={() => handleGameClick(game)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Coming Soon Notice */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 text-center"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-600/50 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">More Games Coming Soon!</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We're constantly working on new interactive experiences to support your mental wellness journey. 
                  Stay tuned for exciting updates and new games that will help you relax, focus, and feel better.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default GamesPage;
