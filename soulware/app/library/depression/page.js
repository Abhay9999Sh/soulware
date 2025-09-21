"use client";

import { motion } from "framer-motion";
import {
  Brain,
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Users,
  Lightbulb,
  Shield,
  Target,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

const DepressionPage = () => {
  const symptoms = [
    "Persistent sadness or emptiness",
    "Loss of interest in activities once enjoyed",
    "Changes in appetite or weight",
    "Sleep disturbances (insomnia or oversleeping)",
    "Fatigue or loss of energy",
    "Feelings of worthlessness or guilt",
    "Difficulty concentrating or making decisions",
    "Recurrent thoughts of death or suicide",
  ];

  const causes = [
    "Biological factors (genetics, brain chemistry)",
    "Environmental stressors (academic pressure, life changes)",
    "Psychological factors (low self-esteem, perfectionism)",
    "Social factors (isolation, relationship difficulties)",
    "Substance use or abuse",
    "Chronic illness or pain",
    "Traumatic life events",
    "Seasonal changes (Seasonal Affective Disorder)",
  ];

  const copingStrategies = [
    {
      title: "Professional Help",
      description: "Seek therapy, counseling, or psychiatric care",
      icon: Users,
      priority: "high",
    },
    {
      title: "Medication",
      description:
        "Consider antidepressant medication under medical supervision",
      icon: Shield,
      priority: "high",
    },
    {
      title: "Regular Exercise",
      description: "Engage in physical activity to boost mood and energy",
      icon: Target,
      priority: "medium",
    },
    {
      title: "Healthy Sleep",
      description: "Maintain consistent sleep schedule and good sleep hygiene",
      icon: Clock,
      priority: "medium",
    },
    {
      title: "Social Support",
      description: "Connect with friends, family, or support groups",
      icon: Heart,
      priority: "high",
    },
    {
      title: "Mindfulness",
      description: "Practice meditation, deep breathing, or yoga",
      icon: Lightbulb,
      priority: "medium",
    },
  ];

  const warningSigns = [
    "Talking about wanting to die or hurt oneself",
    "Looking for ways to kill oneself",
    "Talking about feeling hopeless or having no reason to live",
    "Talking about being a burden to others",
    "Increasing alcohol or drug use",
    "Acting anxious, agitated, or reckless",
    "Sleeping too little or too much",
    "Withdrawing or feeling isolated",
    "Showing rage or talking about seeking revenge",
    "Extreme mood swings",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-indigo-200/20 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
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
                className="mb-8 border-blue-200 text-blue-600 hover:bg-blue-50"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-8">
              <Brain className="w-10 h-10 text-blue-600" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Understanding{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Depression
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A comprehensive guide to understanding depression, its causes,
              symptoms, and evidence-based treatment approaches specifically for
              students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Depression Educational Video */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <VideoPlayer
              videoUrl="https://res.cloudinary.com/dhdvyrvh1/video/upload/v1758287234/Depression_hlrvib.mp4"
              title="Understanding Depression: Support and Recovery"
              description="Learn about depression symptoms, treatment options, and practical strategies for managing depression while maintaining academic and personal well-being."
              className="mb-12"
            />
          </motion.div>
        </div>
      </section>

      {/* What is Depression */}
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
              What is Depression?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="mb-6">
                Depression is a common but serious mood disorder that affects
                how you feel, think, and handle daily activities. It&apos;s more
                than just feeling sad or going through a rough patch. Depression
                is a persistent condition that can significantly impact your
                academic performance, relationships, and overall quality of
                life.
              </p>
              <p className="mb-6">
                For college students, depression can be particularly challenging
                as it often coincides with major life transitions, academic
                pressure, and the stress of building new relationships and
                independence. It&apos;s important to understand that depression
                is not a sign of weakness or something you can simply &quot;snap
                out of.&quot;
              </p>
              <p>
                The good news is that depression is highly treatable, and with
                the right support and treatment, most people can recover and
                lead fulfilling lives.
              </p>
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
              Depression can manifest in many ways. Here are the most common
              symptoms to be aware of:
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
                  <CheckCircle className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{symptom}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Causes Section */}
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
              Causes and Contributing Factors
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Depression rarely has a single cause. It&apos;s typically the
              result of a combination of factors:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {causes.map((cause, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{cause}</span>
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
              There are many effective ways to manage depression. Here are
              evidence-based strategies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {copingStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    strategy.priority === "high"
                      ? "border-red-200 bg-red-50"
                      : "border-blue-200 bg-blue-50"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                        strategy.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <strategy.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {strategy.title}
                        {strategy.priority === "high" && (
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

      {/* Warning Signs */}
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
              If you or someone you know is experiencing any of these warning
              signs, it&apos;s crucial to seek professional help immediately:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {warningSigns.map((sign, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{sign}</span>
                </motion.div>
              ))}
            </div>
            <div className="bg-white/60 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Crisis Resources
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>National Mental Health Helpline (KIRAN):</strong> 1800
                  599 0019
                </p>
                <p className="text-gray-700">
                  <strong>Vandrevala Foundation Helpline:</strong> 1860 266 2345
                </p>
                <p className="text-gray-700">
                  <strong>Emergency Services:</strong> 112
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              You&apos;re Not Alone
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Remember, seeking help is a sign of strength, not weakness. Our
              community and professional resources are here to support you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Connect with Support
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-black hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                Find Resources
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DepressionPage;
