"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
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
  Heart,
  MessageCircle,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ADHDPage = () => {
  const symptoms = [
    "Difficulty focusing or sustaining attention",
    "Easily distracted by external stimuli",
    "Forgetfulness and losing things frequently",
    "Difficulty following through on tasks",
    "Trouble organizing tasks and activities",
    "Avoiding tasks that require sustained mental effort",
    "Fidgeting or restlessness",
    "Difficulty waiting or taking turns",
    "Interrupting others or blurting out answers",
    "Excessive talking or difficulty being quiet"
  ];

  const types = [
    {
      name: "Inattentive Type",
      description: "Primarily difficulty with attention and focus",
      icon: Brain,
      color: "blue"
    },
    {
      name: "Hyperactive-Impulsive Type",
      description: "Primarily hyperactivity and impulsivity",
      icon: Zap,
      color: "yellow"
    },
    {
      name: "Combined Type",
      description: "Both inattentive and hyperactive-impulsive symptoms",
      icon: Target,
      color: "green"
    }
  ];

  const studyStrategies = [
    {
      title: "Pomodoro Technique",
      description: "Work for 25 minutes, then take a 5-minute break",
      icon: Clock,
      priority: "high"
    },
    {
      title: "Body Doubling",
      description: "Study with a friend or in a group setting",
      icon: Users,
      priority: "high"
    },
    {
      title: "Environmental Control",
      description: "Minimize distractions and create a focused study space",
      icon: Shield,
      priority: "high"
    },
    {
      title: "Break Down Tasks",
      description: "Divide large assignments into smaller, manageable chunks",
      icon: Target,
      priority: "high"
    },
    {
      title: "Use Visual Aids",
      description: "Color-coding, charts, and diagrams can help with focus",
      icon: Lightbulb,
      priority: "medium"
    },
    {
      title: "Regular Exercise",
      description: "Physical activity helps improve focus and reduce hyperactivity",
      icon: Heart,
      priority: "medium"
    }
  ];

  const accommodations = [
    "Extended time on exams and assignments",
    "Note-taking assistance or recorded lectures",
    "Preferential seating in classrooms",
    "Breaks during long classes or exams",
    "Alternative testing formats",
    "Priority registration for classes",
    "Access to quiet study spaces",
    "Assistive technology tools"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-yellow-200/20 rounded-full blur-xl"
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
          className="absolute top-40 right-32 w-24 h-24 bg-orange-200/20 rounded-full blur-xl"
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
                className="mb-8 border-yellow-200 text-yellow-600 hover:bg-yellow-50"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-8">
              <Zap className="w-10 h-10 text-yellow-600" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Managing{" "}
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                ADHD
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Managing ADHD in academic settings, study strategies, and building 
              supportive routines for college success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is ADHD */}
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
              What is ADHD?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="mb-6">
                Attention-Deficit/Hyperactivity Disorder (ADHD) is a neurodevelopmental condition 
                that affects attention, impulse control, and activity levels. It&apos;s not a character 
                flaw or a sign of laziness – it&apos;s a real, treatable condition that affects how 
                the brain functions.
              </p>
              <p className="mb-6">
                For college students with ADHD, academic life can present unique challenges, but 
                with the right strategies, accommodations, and support, students with ADHD can 
                absolutely succeed in higher education and beyond.
              </p>
              <p>
                Many people with ADHD also have unique strengths like creativity, hyperfocus, 
                and the ability to think outside the box. The key is learning to work with 
                your brain, not against it.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Types of ADHD */}
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
              Types of ADHD
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {types.map((type, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    type.color === 'blue' ? 'border-blue-200 bg-blue-50' :
                    type.color === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
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
                      type.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {type.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{type.description}</p>
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
              ADHD symptoms can vary widely from person to person. Here are common signs:
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
                  <CheckCircle className="w-6 h-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{symptom}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Study Strategies */}
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
              Study Strategies for ADHD
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              These strategies can help you work with your ADHD brain to achieve academic success:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studyStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    strategy.priority === 'high' 
                      ? 'border-yellow-200 bg-yellow-50' 
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
                        ? 'bg-yellow-100 text-yellow-600' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      <strategy.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {strategy.title}
                        {strategy.priority === 'high' && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
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

      {/* Accommodations */}
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
              <Calendar className="w-8 h-8 text-orange-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Academic Accommodations
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Many colleges offer accommodations to help students with ADHD succeed:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accommodations.map((accommodation, index) => (
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
                  <span className="text-gray-700">{accommodation}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-white/60 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                How to Get Accommodations
              </h3>
              <p className="text-gray-700">
                Contact your college&apos;s disability services office to learn about the documentation 
                required and the process for requesting accommodations. You&apos;ll typically need a 
                recent evaluation from a qualified professional.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Treatment Options */}
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
              Treatment and Support Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Brain className="w-6 h-6 text-blue-600 mr-3" />
                  Professional Treatment
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Medication (stimulants, non-stimulants)</li>
                  <li>• Cognitive Behavioral Therapy (CBT)</li>
                  <li>• ADHD coaching</li>
                  <li>• Skills training</li>
                </ul>
              </div>
              <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Heart className="w-6 h-6 text-green-600 mr-3" />
                  Self-Care Strategies
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Regular exercise and physical activity</li>
                  <li>• Healthy sleep habits</li>
                  <li>• Mindfulness and meditation</li>
                  <li>• Support groups</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* When to Seek Help */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-yellow-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-yellow-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                When to Seek Professional Help
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Consider seeking professional evaluation if:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Symptoms significantly impact daily functioning</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Academic performance is suffering</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Relationships are being affected</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Self-help strategies aren&apos;t enough</span>
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campus Resources
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Disability Services:</strong> Academic accommodations and support
                </p>
                <p className="text-gray-700">
                  <strong>Counseling Center:</strong> Mental health support and therapy
                </p>
                <p className="text-gray-700">
                  <strong>Health Services:</strong> Medical evaluation and treatment options
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
            className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl p-12 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ADHD is Your Superpower
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              With the right strategies and support, ADHD can be a source of creativity, 
              innovation, and unique strengths. You have what it takes to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Support
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-yellow-600 px-8 py-4 text-lg rounded-xl transition-all duration-300"
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

export default ADHDPage;
