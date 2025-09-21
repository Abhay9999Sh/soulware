"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  Shield, 
  Users, 
  Target, 
  Award, 
  Lock, 
  Eye,
  CheckCircle,
  Quote,
  Star,
  ArrowRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Empathy First",
      description: "Every interaction is guided by compassion, understanding, and genuine care for your wellbeing.",
      color: "soft-blue"
    },
    {
      icon: Shield,
      title: "Confidentiality",
      description: "Your privacy and safety are our top priorities. All conversations and data are completely secure.",
      color: "soft-green"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with peers who understand your journey and provide mutual support and encouragement.",
      color: "soft-purple"
    },
    {
      icon: Target,
      title: "Accessibility",
      description: "Mental health support should be available to everyone, regardless of background or circumstances.",
      color: "soft-blue"
    }
  ];

  const team = [
    {
      name: "Krishna Jain",
      role: "Creative & UI/UX Lead",
      bio: "Crafter Who designs beautiful, intuitive interfaces and give creative direction for our platform.",
      image: "👨‍🎨"
    },
    {
      name: "Vansh",
      role: "Frontend & Systems Architect",
      bio: "Architect who design the core systems for our mental health support System and platform.",
      image: "👨‍💻"
    },
    {
      name: "Abhay",
      role: "Backend & Infrastructure Lead",
      bio: "Builds robust, scalable systems that ensure our platform is always available when you need it.",
      image: "👨‍🔧"
    },
    {
      name: "Manmeet",
      role: "Research & Learning Systems",
      bio: "Researches and implements evidence-based approaches to mental health support and learning.",
      image: "👩‍🔬"
    },
    {
      name: "Vidhatri",
      role: "UX Content & Presentation Lead",
      bio: "Creates compelling content and presentations that resonate with students and build trust.",
      image: "👩‍💼"
    },
    {
      name: "Srishti",
      role: "AI & Chatbot Development",
      bio: "Develops intelligent AI systems that provide personalized, empathetic support 24/7.",
      image: "👩‍💻"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students Helped", icon: Users },
    { number: "95%", label: "User Satisfaction", icon: Star },
    { number: "24/7", label: "Support Available", icon: Clock },
    { number: "100%", label: "Confidential", icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-32 w-24 h-24 bg-purple-200/30 rounded-full blur-xl"
            animate={{
              y: [0, 15, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/3 w-40 h-40 bg-green-200/30 rounded-full blur-xl"
            animate={{
              y: [0, -25, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Mission: To Build a{" "}
            <span className="soft-blue">Sanctuary of Support</span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-800 dark:text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Born from a simple belief: every student deserves access to compassionate, 
            confidential mental health support. We are here to break down barriers and 
            build bridges to wellness, inspired by the real struggles students face every day.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800 transition-all duration-1000">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-800 dark:text-gray-100 max-w-4xl mx-auto leading-relaxed">
              We believe that mental health support should be accessible, stigma-free, and empowering. 
              Our platform creates a safe space where students can find the resources, community, and 
              professional support they need to thrive academically and personally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Why We are Different</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white mb-2">Student-Focused Design</h4>
                    <p className="text-gray-800 dark:text-gray-100">Built specifically for the unique challenges and needs of student life.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white mb-2">Complete Anonymity</h4>
                    <p className="text-gray-800 dark:text-gray-100">Your privacy is protected with end-to-end encryption and anonymous options.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white mb-2">24/7 Availability</h4>
                    <p className="text-gray-800 dark:text-gray-100">Support is available whenever you need it, day or night.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white mb-2">Evidence-Based Approach</h4>
                    <p className="text-gray-800 dark:text-gray-100">All resources and methods are backed by scientific research and best practices.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-gray-600/50"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Quote className="w-12 h-12 text-blue-500 mx-auto mb-6" />
              <blockquote className="text-xl text-gray-900 dark:text-gray-100 italic mb-6 leading-relaxed">
                &quot;We started Soulware because we saw too many students struggling in silence. 
                Mental health should not be a luxury—it should be a fundamental right for every student.&quot;
              </blockquote>
              <div className="text-center">
                <p className="font-semibold text-black dark:text-white">- The Soulware Team</p>
                <p className="text-gray-800 dark:text-gray-100">Founded 2024</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do and every decision we make.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 ${value.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className={`w-8 h-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Numbers that reflect our commitment to student mental health and wellness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-gray-600/50">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{stat.number}</div>
                  <div className="text-gray-700 dark:text-gray-200 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Passionate professionals dedicated to supporting your mental health journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800 transition-all duration-1000">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-8">
              <Lock className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Your Privacy is Sacred
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              We use industry-leading encryption and security measures to protect your data. 
              Your conversations, personal information, and mental health records are completely 
              confidential and never shared without your explicit consent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/library">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Explore Our Resources
                </Button>
              </Link>
              <AuthButton
                isDashboardRoute={true}
                isProtected={true}
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                Get Started
              </AuthButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 gradient-calm dark:bg-gradient-to-r dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-1000">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take the first step towards better mental health. Join thousands of students who have found support and community with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthButton
                isDashboardRoute={true}
                isProtected={true}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </AuthButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
