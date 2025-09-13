"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Bot, 
  MessageCircle, 
  X, 
  Send,
  Minimize2,
  Maximize2,
  Sparkles,
  Heart,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

const FloatingChatbot = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi ${user?.firstName || "there"}! 👋 I'm your AI wellness companion. I'm here to provide support, answer questions about mental health, and help you navigate your wellness journey. How are you feeling today?`,
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    { text: "I'm feeling anxious", icon: "😰", color: "text-orange-600" },
    { text: "I need motivation", icon: "💪", color: "text-blue-600" },
    { text: "Help with stress", icon: "😓", color: "text-red-600" },
    { text: "I'm doing well!", icon: "😊", color: "text-green-600" }
  ];

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand how you're feeling. It's completely normal to experience these emotions. Would you like to talk about what's been on your mind lately?",
        "Thank you for sharing that with me. Remember, seeking support is a sign of strength. What would be most helpful for you right now?",
        "I'm here to listen and support you. Sometimes it helps to break things down into smaller, manageable steps. What's one small thing you could do today to take care of yourself?",
        "That sounds challenging. You're not alone in feeling this way. Many students experience similar feelings. Have you tried any coping strategies that have helped before?",
        "I appreciate you opening up to me. Your mental health matters, and it's important to acknowledge these feelings. Would you like some specific techniques to help manage what you're experiencing?"
      ];

      const botMessage = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickReply = (replyText) => {
    setMessage(replyText);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                boxShadow: [
                  "0 10px 30px rgba(139, 92, 246, 0.3)",
                  "0 10px 30px rgba(59, 130, 246, 0.3)",
                  "0 10px 30px rgba(139, 92, 246, 0.3)"
                ]
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Bot className="w-8 h-8" />
              </motion.div>
              
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Notification dot */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-xs text-white font-bold">!</span>
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ 
              scale: isMinimized ? 0.3 : 1, 
              opacity: 1, 
              y: 0,
              transformOrigin: "bottom right"
            }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={`bg-white  dark:bg-gray-900 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden ${
              isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
            } transition-all duration-300`}>
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{ rotate: isMinimized ? 0 : 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Bot className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold">AI Wellness Companion</h3>
                    {!isMinimized && (
                      <p className="text-xs text-white/80">Always here to help 💙</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto max-h-[400px] space-y-4">
                    <AnimatePresence>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className="max-w-[80%]">
                            <div
                              className={`px-4 py-3 rounded-2xl ${
                                msg.sender === "user"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                              {msg.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-3 rounded-2xl">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-300 ml-2">AI is thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Quick Replies */}
                  {messages.length === 1 && (
                    <motion.div
                      className="px-4 pb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Quick responses:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickReplies.map((reply, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleQuickReply(reply.text)}
                            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-xs transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            <span className="mr-2">{reply.icon}</span>
                            {reply.text}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                        />
                      </div>
                      <motion.button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      AI responses are for support only. For emergencies, call 911.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
