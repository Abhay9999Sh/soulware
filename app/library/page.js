"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Clock, 
  Heart, 
  Brain, 
  Zap,
  ArrowRight,
  Compass,
  Book,
  Lightbulb,
  Users,
  Target,
  ChevronRight,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import { useState } from "react";
import Link from "next/link";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const topics = [
    {
      id: "depression",
      title: "Depression",
      description: "Understanding depression, its causes, symptoms, and evidence-based treatment approaches for students.",
      icon: Brain,
      color: "blue",
      articles: 1,
      videos: 1,
      readTime: "5 min read"
    },
    {
      id: "anxiety",
      title: "Anxiety",
      description: "Comprehensive guide to anxiety disorders, panic attacks, and practical coping strategies for college life.",
      icon: Heart,
      color: "red",
      articles: 1,
      videos: 1,
      readTime: "5 min read"
    },
    {
      id: "loneliness",
      title: "Loneliness",
      description: "Navigating social isolation, building meaningful connections, and creating supportive relationships.",
      icon: Users,
      color: "purple",
      articles: 1,
      videos: 1,
      readTime: "5 min read"
    },
    {
      id: "sadness",
      title: "Sadness",
      description: "Understanding normal sadness vs. clinical depression, healthy grieving, and emotional processing.",
      icon: BookOpen,
      color: "indigo",
      articles: 1,
      videos: 1,
      readTime: "5 min read"
    },
    {
      id: "adhd",
      title: "ADHD",
      description: "Managing ADHD in academic settings, study strategies, and building supportive routines.",
      icon: Zap,
      color: "yellow",
      articles: 1,
      videos: 1,
      readTime: "5 min read"
    },
    {
      id: "stress",
      title: "Stress",
      description: "Academic stress management, time management, and building resilience during challenging periods.",
      icon: Target,
      color: "green",
      articles: 1,
      videos: 1,
      readTime: "5 min read"
    }
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      red: "bg-red-100 text-red-600 border-red-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
      yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
      green: "bg-green-100 text-green-600 border-green-200"
    };
    return colorMap[color] || colorMap.blue;
  };

  const pluralize = (count, word) => `${count} ${count === 1 ? word : word + "s"}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-1000">
      {/* Background Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-200/20 rounded-full blur-xl"
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-green-200/20 rounded-full blur-xl"
          animate={{ y: [0, -25, 0], x: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-yellow-200/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header Section */}
      <section className="relative px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Compass className="w-10 h-10 text-blue-600" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-6">
              The Well of{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wisdom
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              A curated library of research-backed insights for your well-being. 
              Dive deep into comprehensive guides that understand your journey.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for topics like 'Anxiety', 'Stress', 'Depression'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="relative py-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Explore Mental Health Topics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive, science-backed resources designed specifically for students
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={`/library/${topic.id}`}>
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/20 h-full group-hover:border-blue-200 dark:group-hover:border-blue-400">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 ${getColorClasses(topic.color)} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <topic.icon className="w-8 h-8" />
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {topic.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {topic.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Book className="w-4 h-4 mr-1" />
                          <span>{pluralize(topic.articles, "article")}</span>
                        </div>
                        <div className="flex items-center">
                          <Video className="w-4 h-4 mr-1" />
                          <span>{pluralize(topic.videos, "video")}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{topic.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        <span>Explore Topic</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">No topics found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Try adjusting your search criteria.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
            </div>
            
            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Lightbulb className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              
              <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Our team is constantly expanding our library with new research and insights. 
                Request a topic or suggest content that would help you on your mental health journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/about">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 px-10 py-5 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Learn More About Us
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <AuthButton
                  href="/dashboard"
                  isProtected={true}
                  size="lg"
                  variant="outline"
                  className="bg-purple-500 text-white hover:bg-purple-700 hover:text-white px-10 py-5 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Get Started
                </AuthButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Library;
