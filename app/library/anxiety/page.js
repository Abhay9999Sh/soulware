"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Users,
  Lightbulb,
  Shield,
  Target,
  Star,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

const AnxietyPage = () => {
  const symptoms = [
    "Excessive worry or fear",
    "Restlessness or feeling on edge",
    "Fatigue or difficulty concentrating",
    "Irritability",
    "Muscle tension or aches",
    "Sleep disturbances",
    "Rapid heartbeat or palpitations",
    "Sweating, trembling, or shaking",
    "Shortness of breath or feeling smothered",
    "Nausea or stomach problems"
  ];

  const types = [
    {
      name: "Generalized Anxiety Disorder (GAD)",
      description: "Excessive anxiety and worry about various aspects of life",
      icon: Brain
    },
    {
      name: "Social Anxiety Disorder",
      description: "Intense fear of social situations and being judged by others",
      icon: Users
    },
    {
      name: "Panic Disorder",
      description: "Recurrent panic attacks with physical symptoms",
      icon: Zap
    },
    {
      name: "Specific Phobias",
      description: "Intense fear of specific objects or situations",
      icon: Shield
    }
  ];

  const copingStrategies = [
    {
      title: "Deep Breathing",
      description: "Practice 4-7-8 breathing or box breathing techniques",
      icon: Heart,
      priority: "high"
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Systematically tense and relax different muscle groups",
      icon: Target,
      priority: "high"
    },
    {
      title: "Mindfulness Meditation",
      description: "Focus on the present moment without judgment",
      icon: Lightbulb,
      priority: "high"
    },
    {
      title: "Cognitive Behavioral Therapy",
      description: "Work with a therapist to challenge negative thought patterns",
      icon: Brain,
      priority: "high"
    },
    {
      title: "Regular Exercise",
      description: "Physical activity helps reduce anxiety and stress",
      icon: Zap,
      priority: "medium"
    },
    {
      title: "Limit Caffeine and Alcohol",
      description: "These substances can worsen anxiety symptoms",
      icon: Shield,
      priority: "medium"
    }
  ];

  const panicAttackSteps = [
    "Recognize it's a panic attack",
    "Focus on your breathing",
    "Use grounding techniques (5-4-3-2-1 method)",
    "Remind yourself it will pass",
    "Stay in the present moment",
    "Seek support if needed"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-red-200/20 rounded-full blur-xl"
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
          className="absolute top-40 right-32 w-24 h-24 bg-pink-200/20 rounded-full blur-xl"
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
                className="mb-8 border-red-200 text-red-600 hover:bg-red-50"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-8">
              <Heart className="w-10 h-10 text-red-600" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Understanding{" "}
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Anxiety
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A comprehensive guide to anxiety disorders, panic attacks, and practical 
              coping strategies specifically designed for college students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Anxiety Educational Video */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <VideoPlayer
              videoUrl="https://res.cloudinary.com/dhdvyrvh1/video/upload/v1758287213/Anxiety_ytvslv.mp4"
              title="Managing Anxiety: Techniques and Coping Strategies"
              description="Discover effective techniques for managing anxiety, including breathing exercises, grounding methods, and building resilience for daily challenges."
              className="mb-12"
            />
          </motion.div>
        </div>
      </section>

      {/* What is Anxiety */}
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
              What is Anxiety?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="mb-6">
                Anxiety is a normal and often healthy emotion. However, when a person regularly feels 
                disproportionate levels of anxiety, it might become a medical disorder. Anxiety disorders 
                are the most common mental health condition, affecting millions of people worldwide.
              </p>
              <p className="mb-6">
                For college students, anxiety can be particularly challenging as it often interferes with 
                academic performance, social relationships, and daily functioning. The pressure of exams, 
                social situations, and life transitions can trigger or worsen anxiety symptoms.
              </p>
              <p>
                The good news is that anxiety disorders are highly treatable, and with the right strategies 
                and support, you can learn to manage your anxiety effectively.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Types of Anxiety */}
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
              Types of Anxiety Disorders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {types.map((type, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-red-50 rounded-2xl border border-red-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                      <type.icon className="w-6 h-6 text-red-600" />
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
              Common Symptoms
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Anxiety can manifest in many ways. Here are the most common symptoms:
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
                  <CheckCircle className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
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
              Coping Strategies and Solutions
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              There are many effective ways to manage anxiety. Here are evidence-based strategies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {copingStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    strategy.priority === 'high' 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-orange-200 bg-orange-50'
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
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      <strategy.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {strategy.title}
                        {strategy.priority === 'high' && (
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
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

      {/* Panic Attack Help */}
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
              <Zap className="w-8 h-8 text-orange-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Managing Panic Attacks
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              If you&apos;re experiencing a panic attack, follow these steps:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {panicAttackSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
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
            className="bg-red-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-red-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                When to Seek Professional Help
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Consider seeking professional help if anxiety is:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Interfering with daily activities</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Causing significant distress</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Lasting for weeks or months</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Not responding to self-help strategies</span>
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Treatment Options
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Therapy:</strong> Cognitive Behavioral Therapy (CBT) is highly effective
                </p>
                <p className="text-gray-700">
                  <strong>Medication:</strong> May be prescribed by a psychiatrist
                </p>
                <p className="text-gray-700">
                  <strong>Lifestyle Changes:</strong> Exercise, sleep, and stress management
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
            className="bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl p-12 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              You Can Overcome Anxiety
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              With the right tools and support, anxiety doesn&apos;t have to control your life. 
              Take the first step towards feeling better today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Support Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AnxietyPage;