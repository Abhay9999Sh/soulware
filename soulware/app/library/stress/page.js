"use client";

import { motion } from "framer-motion";
import { 
  Target, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Users,
  Lightbulb,
  Shield,
  Heart,
  Star,
  Zap,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

const StressPage = () => {
  const symptoms = [
    "Headaches or muscle tension",
    "Fatigue or difficulty sleeping",
    "Changes in appetite",
    "Irritability or mood swings",
    "Difficulty concentrating",
    "Feeling overwhelmed",
    "Rapid heartbeat or chest pain",
    "Digestive problems",
    "Frequent illness",
    "Social withdrawal"
  ];

  const stressTypes = [
    {
      name: "Academic Stress",
      description: "Pressure from exams, assignments, and academic performance",
      icon: BookOpen,
      color: "blue"
    },
    {
      name: "Social Stress",
      description: "Challenges with relationships, social pressure, and fitting in",
      icon: Users,
      color: "purple"
    },
    {
      name: "Financial Stress",
      description: "Worry about money, loans, and financial independence",
      icon: Shield,
      color: "green"
    },
    {
      name: "Time Management Stress",
      description: "Balancing academics, work, social life, and personal time",
      icon: Calendar,
      color: "orange"
    }
  ];

  const copingStrategies = [
    {
      title: "Time Management",
      description: "Create schedules, prioritize tasks, and break large projects into smaller steps",
      icon: Calendar,
      priority: "high"
    },
    {
      title: "Regular Exercise",
      description: "Physical activity reduces stress hormones and improves mood",
      icon: Zap,
      priority: "high"
    },
    {
      title: "Mindfulness and Meditation",
      description: "Practice deep breathing, meditation, or yoga to calm your mind",
      icon: Lightbulb,
      priority: "high"
    },
    {
      title: "Healthy Sleep Habits",
      description: "Maintain consistent sleep schedule and create a relaxing bedtime routine",
      icon: Clock,
      priority: "high"
    },
    {
      title: "Social Support",
      description: "Connect with friends, family, or counselors for emotional support",
      icon: Heart,
      priority: "medium"
    },
    {
      title: "Relaxation Techniques",
      description: "Try progressive muscle relaxation, visualization, or listening to music",
      icon: Brain,
      priority: "medium"
    }
  ];

  const timeManagementTips = [
    "Use a planner or digital calendar",
    "Break large tasks into smaller, manageable chunks",
    "Set realistic goals and deadlines",
    "Eliminate or reduce time-wasting activities",
    "Learn to say no to non-essential commitments",
    "Take regular breaks to avoid burnout",
    "Use the Pomodoro Technique (25-minute work sessions)",
    "Review and adjust your schedule regularly"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-green-200/20 rounded-full blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <section className="relative px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/library">
              <Button
                variant="outline"
                className="mb-8 border-green-200 text-green-600 hover:bg-green-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Library
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
              <Target className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Managing{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Stress
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Academic stress management, time management, and building resilience 
              during challenging periods of student life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stress Educational Video */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <VideoPlayer
              videoUrl="https://res.cloudinary.com/dhdvyrvh1/video/upload/v1758287277/Stress_iyirpx.mp4"
              title="Stress Management: Techniques for Academic and Life Balance"
              description="Learn effective stress management techniques, time management skills, and healthy coping strategies for maintaining balance in academic and personal life."
              className="mb-12"
            />
          </motion.div>
        </div>
      </section>

      {/* What is Stress */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              What is Stress?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="mb-6">
                Stress is your body&apos;s natural response to challenges or demands. In small amounts, 
                stress can be beneficial, helping you stay focused and motivated. However, when 
                stress becomes chronic or overwhelming, it can negatively impact your physical 
                and mental health.
              </p>
              <p className="mb-6">
                College students often face unique stressors including academic pressure, financial 
                concerns, social challenges, and the transition to independence. Learning to manage 
                stress effectively is crucial for both academic success and personal well-being.
              </p>
              <p>
                The key is not to eliminate stress entirely, but to develop healthy coping strategies 
                that help you navigate challenges while maintaining your well-being.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Types of Stress */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Common Types of Student Stress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stressTypes.map((type, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    type.color === 'blue' ? 'border-blue-200 bg-blue-50' :
                    type.color === 'purple' ? 'border-purple-200 bg-purple-50' :
                    type.color === 'green' ? 'border-green-200 bg-green-50' :
                    'border-orange-200 bg-orange-50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                      type.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      type.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      type.color === 'green' ? 'bg-green-100 text-green-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {type.name}
                      </h3>
                      <p className="text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Signs of Stress
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Recognizing stress symptoms is the first step in managing them effectively:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{symptom}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coping Strategies */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Effective Stress Management Strategies
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Here are proven strategies to help you manage stress effectively:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {copingStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    strategy.priority === 'high' 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-blue-200 bg-blue-50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                      strategy.priority === 'high' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <strategy.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {strategy.title}
                        {strategy.priority === 'high' && (
                          <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                            High Priority
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600">{strategy.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Time Management Tips */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-blue-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-blue-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 text-blue-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Time Management Tips
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Effective time management is one of the best ways to reduce academic stress:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeManagementTips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* When to Seek Help */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-orange-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-orange-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                When to Seek Help
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Consider seeking professional help if stress is:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Persistent and overwhelming</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Affecting your academic performance</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Causing physical health problems</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Leading to anxiety or depression</span>
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campus Resources
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Counseling Center:</strong> Free mental health services for students
                </p>
                <p className="text-gray-700">
                  <strong>Academic Support:</strong> Tutoring, study groups, and time management workshops
                </p>
                <p className="text-gray-700">
                  <strong>Health Services:</strong> Medical care and stress management programs
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Take Control of Your Stress
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Stress is a normal part of life, but you have the power to manage it effectively. 
              Start implementing these strategies today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Stress Management Tools
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                Find Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StressPage;