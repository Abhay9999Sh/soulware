"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  X,
  Send,
  Sparkles,
} from "lucide-react";

const motivationalQuotes = [
  "🌟 Believe in yourself — you’re stronger than you think.",
  "🚀 Small steps every day lead to big results.",
  "💡 Progress, not perfection. Keep moving forward.",
  "🔥 Your consistency is your superpower.",
  "🌱 Growth takes time, but every effort counts.",
];

const StudentDashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi there! How can I support you today?" },
  ]);
  const [input, setInput] = useState("");
  const [dailyQuote, setDailyQuote] = useState("");
  const [mood, setMood] = useState(null);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const random = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setDailyQuote(random);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "💡 That’s a great question. Keep going — you’re doing amazing!" },
      ]);
    }, 900);
  };

  const quickActions = [
    {
      title: "AI Chatbot",
      description: "Talk with Soulware AI for guidance & motivation",
      icon: MessageCircle,
      action: () => setIsChatOpen(true),
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Appointments",
      description: "View and manage your counseling sessions",
      icon: Calendar,
      action: () => router.push("/counseling"),
      color: "from-green-500 to-green-600",
    },
    {
      title: "Resources",
      description: "Access curated mental health resources",
      icon: BookOpen,
      action: () => router.push("/library"),
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Peer Forum",
      description: "Connect with fellow students and share experiences",
      icon: Users,
      action: () => router.push("/community"),
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="p-6 space-y-10">
      {/* Motivational Hero */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Welcome back, Student 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Every step you take today brings you closer to your goals. Trust the process—you’ve got this!
        </p>
      </motion.section>

      {/* Daily Motivation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white flex items-center gap-3"
      >
        <Sparkles className="w-6 h-6" />
        <p className="text-lg font-medium">{dailyQuote}</p>
      </motion.section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={item.action}
              className={`cursor-pointer p-6 rounded-2xl shadow-lg bg-gradient-to-br ${item.color} text-white flex flex-col items-start hover:scale-105 transition-transform`}
            >
              <Icon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm opacity-90">{item.description}</p>
            </motion.div>
          );
        })}
      </section>

      {/* Mood Check-In */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">How are you feeling today?</h2>
        <div className="flex gap-4 text-2xl">
          {["😊", "😐", "😞"].map((m, i) => (
            <button
              key={i}
              onClick={() => setMood(m)}
              className={`p-3 rounded-full transition ${
                mood === m ? "bg-blue-100 dark:bg-blue-800" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {mood && (
          <p className="text-gray-600 dark:text-gray-300">
            {mood === "😊" && "Awesome! Keep shining ✨"}
            {mood === "😐" && "It’s okay to have neutral days — stay steady 💪"}
            {mood === "😞" && "Sending you strength 💜 Remember, tough times pass."}
          </p>
        )}
      </motion.section>

      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.button
          onClick={() => setIsChatOpen(true)}
          className="relative p-4 rounded-full shadow-2xl text-white"
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="fixed bottom-0 right-0 w-full sm:w-[420px] h-[72vh] bg-white dark:bg-gray-900 shadow-2xl rounded-t-2xl flex flex-col z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Soulware AI Chat
                  </h3>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[78%] ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t dark:border-gray-700 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;
