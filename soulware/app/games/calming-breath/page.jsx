"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ArrowLeft,
  Wind,
  Heart,
  Star,
  Award,
  Settings
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const CalmingBreathGame = () => {
  const router = useRouter();
  const audioRef = useRef(null);
  
  // Game State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('ready'); // 'ready', 'inhale', 'hold', 'exhale'
  const [breathCount, setBreathCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Breathing Timing (scientifically proven 4-7-8 technique)
  const breathingCycle = {
    inhale: 6,    // 4 seconds
    hold: 4,      // 7 seconds  
    exhale: 5     // 8 seconds
  };
  
  // Customizable settings
  const [settings, setSettings] = useState({
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
    backgroundVideo: 'nature', // 'nature', 'abstract', 'minimal'
    audioTrack: 'forest' // 'forest', 'ocean', 'rain', 'silence'
  });

  // Phase progression
  const phases = ['inhale', 'hold', 'exhale'];
  const phaseMessages = {
    ready: 'Ready to begin your breathing journey?',
    inhale: 'Breathe in slowly and deeply...',
    hold: 'Hold your breath gently...',
    exhale: 'Exhale slowly and completely...'
  };

  // Timer effect
  useEffect(() => {
    let interval;
    
    if (isPlaying && currentPhase !== 'ready') {
      interval = setInterval(() => {
        setPhaseTime(prev => {
          const currentCycleDuration = settings[`${currentPhase}Time`];
          
          if (prev >= currentCycleDuration) {
            // Move to next phase
            const currentIndex = phases.indexOf(currentPhase);
            const nextIndex = (currentIndex + 1) % phases.length;
            const nextPhase = phases[nextIndex];
            
            setCurrentPhase(nextPhase);
            
            // If completed full cycle (back to inhale), increment breath count
            if (nextPhase === 'inhale') {
              setBreathCount(prev => prev + 1);
            }
            
            return 0;
          }
          
          return prev + 0.1;
        });
        
        setTotalTime(prev => prev + 0.1);
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentPhase, settings]);

  // Audio management
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1; // Set volume to 50%
      
      if (isPlaying && isAudioEnabled) {
        // Reset audio to beginning and play
        audioRef.current.currentTime = 0;
        
        // Try to play audio
        audioRef.current.play().then(() => {
          console.log('✅ Audio playing successfully');
        }).catch(error => {
          console.log('❌ Audio play failed:', error.message);
          // Try again with user interaction
          const enableAudio = () => {
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                console.log('✅ Audio enabled after user interaction');
              }).catch(err => {
                console.error('❌ Audio still failed:', err);
              });
            }
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
          };
          document.addEventListener('click', enableAudio);
          document.addEventListener('touchstart', enableAudio);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isAudioEnabled]);

  // Initialize audio on component mount
  useEffect(() => {
    if (audioRef.current) {
      // Set audio properties
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 1;
      
      // Load the audio
      audioRef.current.load();
      
      // Audio event listeners
      const handleLoadedData = () => {
        console.log('✅ Audio file loaded successfully');
        console.log('Audio duration:', audioRef.current?.duration, 'seconds');
      };
      
      const handleError = (e) => {
        console.error('❌ Audio loading error:', e);
        console.error('Audio error details:', audioRef.current?.error);
      };
      
      const handleCanPlay = () => {
        console.log('✅ Audio can start playing');
      };
      
      audioRef.current.addEventListener('loadeddata', handleLoadedData);
      audioRef.current.addEventListener('error', handleError);
      audioRef.current.addEventListener('canplay', handleCanPlay);
      
      // Cleanup
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadeddata', handleLoadedData);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.removeEventListener('canplay', handleCanPlay);
        }
      };
    }
  }, []);

  const startBreathing = () => {
    setIsPlaying(true);
    setCurrentPhase('inhale');
    setPhaseTime(0);
    
    // Force audio play on user interaction (this should work since it's user-initiated)
    if (audioRef.current && isAudioEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        console.log('✅ Audio started with breathing session');
      }).catch(error => {
        console.log('❌ Audio failed to start:', error.message);
        // Try to enable audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.resume().then(() => {
          console.log('Audio context resumed');
          audioRef.current?.play();
        });
      });
    }
  };

  const pauseBreathing = () => {
    setIsPlaying(false);
  };

  const resetBreathing = () => {
    setIsPlaying(false);
    setCurrentPhase('ready');
    setBreathCount(0);
    setTotalTime(0);
    setPhaseTime(0);
  };

  const toggleAudio = () => {
    const newAudioState = !isAudioEnabled;
    setIsAudioEnabled(newAudioState);
    
    if (audioRef.current) {
      if (newAudioState && isPlaying) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => {
          console.log('✅ Audio enabled via toggle');
        }).catch(error => {
          console.log('❌ Audio toggle failed:', error.message);
        });
      } else {
        audioRef.current.pause();
        console.log('🔇 Audio paused/disabled');
      }
    }
  };

  // Calculate progress for current phase
  const getPhaseProgress = () => {
    if (currentPhase === 'ready') return 0;
    const duration = settings[`${currentPhase}Time`];
    return Math.min((phaseTime / duration) * 100, 100);
  };

  // Get breathing circle scale based on phase
  const getBreathingScale = () => {
    const progress = getPhaseProgress();
    
    switch (currentPhase) {
      case 'inhale':
        return 1.0 + (progress / 100) * 0.2; // Scale from 1.0 to 1.2
      case 'hold':
        return 1.2; // Stay at maximum
      case 'exhale':
        return 1.2 - (progress / 100) * 0.2; // Scale from 1.2 to 1.0
      default:
        return 1.0;
    }
  };

  // Get phase color
  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'from-sky-400 to-blue-600';
      case 'hold':
        return 'from-purple-400 to-indigo-600';
      case 'exhale':
        return 'from-pink-400 to-rose-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  // Particle animation variants
  const particleVariants = {
    inhale: {
      scale: [1, 1.5, 1],
      opacity: [0.3, 0.8, 0.3],
      transition: { duration: settings.inhaleTime, repeat: Infinity }
    },
    hold: {
      scale: 1.5,
      opacity: 0.8,
      transition: { duration: 0.5 }
    },
    exhale: {
      scale: [1.5, 0.8, 1.5],
      opacity: [0.8, 0.2, 0.8],
      transition: { duration: settings.exhaleTime, repeat: Infinity }
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative">
        {/* Background Video - Starts below navbar */}
        <div className="fixed top-20 left-0 right-0 bottom-0 overflow-hidden">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/70 to-indigo-900/60" />
        </div>

        {/* Audio */}
        <audio ref={audioRef} loop preload="auto">
          <source src="/breath-calm-song.mp3" type="audio/mpeg" />
          <source src="/breath-calm-song.mp3" type="audio/mp3" />
        </audio>

        {/* Compact Layout - Everything in one screen */}
        <div className="relative z-20  flex flex-col pt-5">
          {/* Game Header - Compact */}
          <div className="flex items-center justify-between px-4 py-2">
            <button
              onClick={() => router.push('/games')}
              className="flex items-center gap-2 text-white hover:text-white transition-colors bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Games</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/50 transition-all border border-white/20"
                title={isAudioEnabled ? 'Mute Audio' : 'Enable Audio'}
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/50 transition-all border border-white/20"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title - Compact */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
                <Wind className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Calming Breath</h1>
            <p className="text-white/80 text-xs">Breathe, relax, and find your inner peace</p>
          </motion.div>

          {/* Stats - Compact */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{breathCount}</div>
              <div className="text-white/60 text-xs">Breaths</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{Math.floor(totalTime / 60)}:{(totalTime % 60).toFixed(0).padStart(2, '0')}</div>
              <div className="text-white/60 text-xs">Time</div>
            </div>
          </div>

          {/* Breathing Circle - Main Focus */}
          <div className="py-10 flex items-center justify-center ">
            <div className="relative">
              {/* Particle Effects */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full pointer-events-none"
                  style={{
                    left: `${50 + 25 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                    top: `${50 + 25 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  variants={particleVariants}
                  animate={currentPhase !== 'ready' ? currentPhase : 'inhale'}
                />
              ))}

              {/* Main Breathing Circle */}
              <motion.div
                className={`w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl flex items-center justify-center relative overflow-hidden`}
                animate={{
                  scale: getBreathingScale(),
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut"
                }}
              >
                {/* Inner Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {currentPhase === 'ready' ? '●' : Math.ceil(settings[`${currentPhase}Time`] - phaseTime)}
                    </div>
                    <div className="text-white/90 text-sm font-medium uppercase tracking-wider">
                      {currentPhase === 'ready' ? 'Ready' : currentPhase}
                    </div>
                  </div>
                </div>

                {/* Progress Ring */}
                {currentPhase !== 'ready' && (
                  <div 
                    className="absolute inset-2 rounded-full border-2 border-white/30"
                    style={{
                      background: `conic-gradient(from 0deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.5) ${getPhaseProgress()}%, transparent ${getPhaseProgress()}%, transparent 100%)`,
                      mask: 'radial-gradient(circle, transparent 65%, black 67%, black 100%)',
                      WebkitMask: 'radial-gradient(circle, transparent 65%, black 67%, black 100%)'
                    }}
                  />
                )}
              </motion.div>
            </div>
          </div>

          {/* Phase Message - Compact */}
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-5"
          >
            <p className="text-white/90 text-sm max-w-xs mx-auto">
              {phaseMessages[currentPhase]}
            </p>
          </motion.div>

          {/* Bottom Controls - Compact */}
          <div className="flex-shrink-0 px-4 pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              {!isPlaying ? (
                <motion.button
                  onClick={startBreathing}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-lg text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4" />
                  {breathCount === 0 ? 'Start' : 'Resume'}
                </motion.button>
              ) : (
                <motion.button
                  onClick={pauseBreathing}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-lg text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </motion.button>
              )}

              <motion.button
                onClick={resetBreathing}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-lg text-white/80 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </motion.button>
            </div>

            {/* Achievements - Compact */}
            {breathCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2"
              >
                {breathCount >= 5 && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-lg text-yellow-200 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3" />
                    <span className="text-xs">5 Breaths!</span>
                  </div>
                )}
                {breathCount >= 10 && (
                  <div className="flex items-center gap-1 bg-purple-500/20 backdrop-blur-lg text-purple-200 px-2 py-1 rounded-full">
                    <Award className="w-3 h-3" />
                    <span className="text-xs">Zen Master!</span>
                  </div>
                )}
                {totalTime >= 300 && (
                  <div className="flex items-center gap-1 bg-green-500/20 backdrop-blur-lg text-green-200 px-2 py-1 rounded-full">
                    <Heart className="w-3 h-3" />
                    <span className="text-xs">5 Minutes!</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Breathing Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Inhale Duration: {settings.inhaleTime}s
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="8"
                      value={settings.inhaleTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, inhaleTime: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hold Duration: {settings.holdTime}s
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="12"
                      value={settings.holdTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, holdTime: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exhale Duration: {settings.exhaleTime}s
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="15"
                      value={settings.exhaleTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, exhaleTime: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setSettings({ inhaleTime: 4, holdTime: 7, exhaleTime: 8, backgroundVideo: 'nature', audioTrack: 'forest' })}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Reset to Default
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
};

export default CalmingBreathGame;
