"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Heart,
  Lightbulb,
  Shield,
  Target,
  Star,
  Zap,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LonelinessPage = () => {
  const symptoms = [
    "Feeling disconnected from others",
    "Lack of meaningful relationships",
    "Social anxiety or fear of rejection",
    "Feeling misunderstood or invisible",
    "Difficulty making friends",
    "Preferring isolation over social interaction",
    "Feeling like an outsider",
    "Lack of emotional support",
    "Difficulty expressing yourself",
    "Feeling empty or hollow inside"
  ];

  const causes = [
    "Major life transitions (starting college, moving)",
    "Social anxiety or shyness",
    "Previous negative social experiences",
    "Academic pressure and time constraints",
    "Technology replacing face-to-face interaction",
    "Cultural or language barriers",
    "Mental health conditions (depression, anxiety)",
    "Low self-esteem or confidence",
    "Perfectionism and fear of judgment",
    "Lack of social skills or experience"
  ];

  const connectionStrategies = [
    {
      title: "Join Clubs and Organizations",
      description: "Find groups that share your interests and values",
      icon: Users,
      priority: "high"
    },
    {
      title: "Attend Campus Events",
      description: "Participate in social activities and meet new people",
      icon: Star,
      priority: "high"
    },
    {
      title: "Volunteer",
      description: "Help others while building meaningful connections",
      icon: Heart,
      priority: "high"
    },
    {
      title: "Study Groups",
      description: "Connect with classmates over shared academic goals",
      icon: BookOpen,
      priority: "medium"
    },
    {
      title: "Online Communities",
      description: "Join virtual groups related to your interests",
      icon: MessageCircle,
      priority: "medium"
    },
    {
      title: "Professional Help",
      description: "Consider therapy to address underlying issues",
      icon: Shield,
      priority: "high"
    }
  ];

  const buildingSkills = [
    "Practice active listening",
    "Ask open-ended questions",
    "Share your own experiences",
    "Show genuine interest in others",
    "Be vulnerable and authentic",
    "Practice good communication",
    "Learn to read social cues",
    "Develop empathy and understanding"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-purple-200/20 rounded-full blur-xl"
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
                className="mb-8 border-purple-200 text-purple-600 hover:bg-purple-50"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-8">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Overcoming{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Loneliness
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Navigating social isolation, building meaningful connections, and creating 
              supportive relationships during your college journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Loneliness */}
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
              What is Loneliness?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="mb-6">
                Loneliness is a complex emotional state that occurs when there&apos;s a gap between 
                the social connections you have and the ones you want or need. It&apos;s not just 
                about being alone – you can feel lonely even when surrounded by people.
              </p>
              <p className="mb-6">
                For college students, loneliness often stems from the transition to a new environment, 
                academic pressure, or difficulty forming meaningful relationships. It&apos;s a common 
                experience that affects many students, especially during the first year of college.
              </p>
              <p>
                The important thing to remember is that loneliness is temporary and treatable. 
                With the right strategies and support, you can build meaningful connections and 
                overcome feelings of isolation.
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
              Signs of Loneliness
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Recognizing loneliness is the first step toward building meaningful connections:
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
                  <CheckCircle className="w-6 h-6 text-purple-500 mr-3 mt-1 flex-shrink-0" />
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
              Common Causes
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Understanding what contributes to loneliness can help you address it effectively:
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
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{cause}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Connection Strategies */}
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
              Building Meaningful Connections
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Here are practical strategies to help you connect with others and overcome loneliness:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connectionStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    strategy.priority === 'high' 
                      ? 'border-purple-200 bg-purple-50' 
                      : 'border-pink-200 bg-pink-50'
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
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-pink-100 text-pink-600'
                    }`}>
                      <strategy.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {strategy.title}
                        {strategy.priority === 'high' && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
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

      {/* Building Social Skills */}
      <section className="relative px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-pink-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-pink-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <MessageCircle className="w-8 h-8 text-pink-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Building Social Skills
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Developing strong social skills can help you form deeper connections:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buildingSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{skill}</span>
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
            className="bg-purple-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-purple-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-purple-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                When to Seek Professional Help
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Consider seeking help if loneliness is:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Persistent and overwhelming</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Leading to depression or anxiety</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Affecting your academic performance</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Causing physical health problems</span>
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campus Resources
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Counseling Center:</strong> Individual and group therapy options
                </p>
                <p className="text-gray-700">
                  <strong>Student Organizations:</strong> Find clubs that match your interests
                </p>
                <p className="text-gray-700">
                  <strong>Peer Support Groups:</strong> Connect with others facing similar challenges
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              You Deserve Meaningful Connections
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Loneliness is temporary, but the connections you build can last a lifetime. 
              Take the first step toward building the relationships you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Find Your Community
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                Get Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LonelinessPage;
