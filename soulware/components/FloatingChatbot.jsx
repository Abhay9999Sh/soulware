"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Maximize2, 
  Minimize2, 
  Heart, 
  Sparkles, 
  MessageCircle,
  Zap,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

// Dreamy Color Palette (matching your theme)
const colors = {
  primary: '#6495ED',
  secondary: '#E996AF', 
  tertiary: '#A3A3CC',
  accent: '#E6B38F',
};

export default function FloatingChatbot({ isOpen, setIsOpen }) {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);

  // Add the initial greeting message only once when the chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: `Hi ${user?.firstName || "there"}! 👋 I'm your AI wellness companion. How can I help you today?`,
          sender: "bot",
        }
      ]);
    }
  }, [isOpen, messages.length, user]);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- REAL AI INTEGRATION ---
  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message; // Store message before clearing
    setMessage("");
    setIsTyping(true);

    try {
      // Step 1: Send the user's message to your AI backend
      const response = await fetch('https://carebot-fe1t.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const aiData = await response.json();
      
      // Step 2: Create a new bot message with the AI's response
      const botMessage = {
        id: Date.now() + 1,
        // Use the 'reply' key from your API's JSON response
        text: aiData.reply || "Sorry, I couldn't process that. Please try again.",
        sender: "bot",
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having a little trouble connecting right now. Please try again in a moment.",
        sender: "bot",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center"
              aria-label="Open AI Chatbot"
            >
              <Bot className="w-8 h-8" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm h-[70vh] max-h-[600px]"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-700 flex flex-col h-full">
              <header className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6" />
                  <h3 className="font-semibold">AI Wellness Companion</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full" aria-label="Close Chatbot">
                  <X className="w-5 h-5" />
                </button>
              </header>

              <main className="flex-1 p-4 overflow-y-auto space-y-4" ref={messagesEndRef}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl">
                           <div className="flex items-center justify-center gap-1">
                               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                           </div>
                        </div>
                    </motion.div>
                )}
                <div />
              </main>

              <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <Button type="submit" disabled={!message.trim() || isTyping} className="p-3" aria-label="Send Message">
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                   AI responses are for support only. For emergencies, please seek professional help.
                 </p>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};