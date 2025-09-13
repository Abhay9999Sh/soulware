"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  ArrowLeft, 
  Heart, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Users,
  Lightbulb,
  Shield,
  Target,
  Star,
  Zap,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SadnessPage = () => {
  const normalSadness = [
    "Temporary emotional response to difficult events",
    "Proportional to the situation",
    "Doesn't significantly impair daily functioning",
    "Improves over time with support",
    "Allows for other emotions and experiences",
    "Doesn't involve persistent negative thoughts",
    "Responds well to self-care and social support",
    "Doesn't require professional intervention"
  ];

  const clinicalDepression = [
    "Persistent sadness lasting weeks or months",
    "Disproportionate to life circumstances",
    "Significantly impairs daily functioning",
    "Doesn't improve with time or support",
    "Dominates emotional experience",
    "Involves persistent negative thoughts",
    "May require professional treatment",
    "Can include physical symptoms"
  ];

  const healthyCoping = [
    {
      title: "Express Your Feelings",
      description: "Talk to trusted friends, family, or write in a journal",
      icon: MessageCircle,
      priority: "high"
    },
    {
      title: "Self-Care Activities",
      description: "Engage in activities that bring you comfort and joy",
      icon: Heart,
      priority: "high"
    },
    {
      title: "Maintain Routine",
      description: "Keep regular sleep, meals, and daily activities",
      icon: Clock,
      priority: "medium"
    },
    {
      title: "Physical Activity",
      description: "Exercise releases endorphins and improves mood",
      icon: Zap,
      priority: "medium"
    },
    {
      title: "Connect with Others",
      description: "Spend time with supportive people who care about you",
      icon: Users,
      priority: "high"
    },
    {
      title: "Professional Support",
      description: "Consider therapy if sadness persists or worsens",
      icon: Shield,
      priority: "medium"
    }
  ];

  const griefStages = [
    "Denial - Initial shock and disbelief",
    "Anger - Frustration and resentment",
    "Bargaining - Attempting to negotiate or change the situation",
    "Depression - Deep sadness and withdrawal",
    "Acceptance - Coming to terms with the loss"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-indigo-200/20 rounded-full blur-xl"
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
          className="absolute top-40 right-32 w-24 h-24 bg-blue-200/20 rounded-full blur-xl"
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
                className="mb-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-8">
              <BookOpen className="w-10 h-10 text-indigo-600" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Understanding{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Sadness
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Understanding normal sadness vs. clinical depression, healthy grieving, 
              and emotional processing for students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Sadness */}
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
              What is Sadness?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="mb-6">
                Sadness is a natural human emotion that we all experience at various times in our lives. 
                It&apos;s a normal response to loss, disappointment, or difficult situations. For college students, 
                sadness can arise from academic challenges, relationship difficulties, homesickness, or 
                major life transitions.
              </p>
              <p className="mb-6">
                It&apos;s important to distinguish between normal sadness and clinical depression. While sadness 
                is temporary and proportional to the situation, depression is a persistent condition that 
                significantly impacts daily functioning and requires professional treatment.
              </p>
              <p>
                Learning to process sadness in healthy ways is an important life skill that can help you 
                navigate difficult times while maintaining your mental health and well-being.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Normal vs Clinical */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              className="bg-green-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-green-200"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                Normal Sadness
              </h3>
              <div className="space-y-3">
                {normalSadness.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-red-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-red-200"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                Clinical Depression
              </h3>
              <div className="space-y-3">
                {clinicalDepression.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Healthy Coping Strategies */}
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
              Healthy Ways to Process Sadness
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Here are evidence-based strategies for processing sadness in healthy ways:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {healthyCoping.map((strategy, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    strategy.priority === 'high' 
                      ? 'border-indigo-200 bg-indigo-50' 
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
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <strategy.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {strategy.title}
                        {strategy.priority === 'high' && (
                          <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
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

      {/* Grief and Loss */}
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
              <Heart className="w-8 h-8 text-blue-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Understanding Grief and Loss
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Grief is a natural response to loss. The grieving process often involves these stages:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {griefStages.map((stage, index) => (
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
                  <span className="text-gray-700">{stage}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-white/60 rounded-2xl">
              <p className="text-gray-700 italic">
                <strong>Note:</strong> These stages are not linear and everyone experiences grief differently. 
                There&apos;s no &quot;right&quot; way to grieve, and it&apos;s important to be patient and compassionate with yourself.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* When to Seek Help */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-indigo-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-indigo-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-indigo-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                When to Seek Professional Help
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Consider seeking professional help if:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Sadness persists for more than 2 weeks</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">You&apos;re unable to function in daily life</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">You have thoughts of self-harm</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">You&apos;re using substances to cope</span>
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campus Resources
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Counseling Center:</strong> Individual therapy and support groups
                </p>
                <p className="text-gray-700">
                  <strong>Health Services:</strong> Medical evaluation and treatment options
                </p>
                <p className="text-gray-700">
                  <strong>Peer Support:</strong> Connect with other students facing similar challenges
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
            className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-12 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Feelings Are Valid
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Sadness is a natural part of being human. It&apos;s okay to feel sad, and it&apos;s okay to ask for help 
              when you need it. You don&apos;t have to go through difficult times alone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Find Support
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg rounded-xl transition-all duration-300"
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

export default SadnessPage;
