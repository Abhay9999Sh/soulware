"use client";

import { useState, useEffect, useRef, use } from 'react';
import { useUser } from '@clerk/nextjs';
import { Send, Loader, User as UserIcon, ArrowLeft, MessageCircle, Clock, CheckCircle, Shield, Smile, Paperclip, Phone, Video, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRealtimeSocket } from '@/hooks/userealtime';

// --- Sub-components for the new layout ---

const ConversationSidebar = ({ conversations, activeConversationId, currentUserRole }) => (
    <motion.aside 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/3 lg:w-1/4 glass-strong border-r border-white/20 dark:border-gray-700/20 flex flex-col"
    >
        <div className="p-6 border-b border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-3">
                <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <MessageCircle className="w-5 h-5 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Chats</h1>
            </div>
        </div>
        <div className="overflow-y-auto flex-1 p-4">
            <div className="space-y-3">
                {conversations.map((convo, index) => {
                    const otherUser = convo.otherParticipant;
                    
                    // Display logic for sidebar
                    const getSidebarDisplayInfo = () => {
                        if (currentUserRole === 'counselor') {
                            return {
                                name: 'Anonymous Student',
                                avatar: '👤',
                                bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600'
                            };
                        } else {
                            return {
                                name: otherUser?.profile?.displayName || 'Professional Counselor',
                                avatar: otherUser?.profile?.displayName?.charAt(0) || '👩‍⚕️',
                                bgColor: 'bg-gradient-to-r from-green-500 to-blue-500'
                            };
                        }
                    };
                    
                    const sidebarInfo = getSidebarDisplayInfo();
                    
                    return (
                        <Link href={`/chat/${convo._id}`} key={convo._id}>
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 hover-lift ${
                                    activeConversationId === convo._id 
                                        ? 'glass bg-green-500/10 border-green-500/50 shadow-lg shadow-green-500/20' 
                                        : 'glass border-white/20 hover:border-green-400/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${sidebarInfo.bgColor}`}
                                        animate={activeConversationId === convo._id ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        {sidebarInfo.avatar}
                                    </motion.div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-bold text-gray-900 dark:text-white truncate">
                                            {sidebarInfo.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {convo.lastMessage || 'Start a conversation'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </div>
    </motion.aside>
);

const ChatWindow = ({ conversation, messages, user, onSendMessage, socket, typing }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const router = useRouter();
    const typingTimeoutRef = useRef(null);
    const [lastMessageCount, setLastMessageCount] = useState(0);
    
    // Get current user's role to determine display logic
    const [currentUserRole, setCurrentUserRole] = useState(null);

    // Smooth scroll with intelligent delay based on message changes
    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesEndRef.current) {
                const isNewMessage = messages.length > lastMessageCount;
                const delay = isNewMessage ? 150 : 50; // Longer delay for new messages
                
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'end',
                        inline: 'nearest'
                    });
                }, delay);
            }
        };
        
        if (messages.length !== lastMessageCount) {
            setLastMessageCount(messages.length);
            scrollToBottom();
        }
    }, [messages, lastMessageCount]);
    
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await fetch('/api/users/me');
                const userData = await res.json();
                setCurrentUserRole(userData.role);
            } catch (error) {
                console.error('Failed to fetch user role:', error);
            }
        };
        if (user) fetchUserRole();
    }, [user]);

    // Guard clause: Don't render if user is not available (MOVED AFTER ALL HOOKS)
    if (!user || !conversation) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Loading chat...</p>
                </div>
            </div>
        );
    }
    
    const otherUser = conversation.participants?.find(p => p.clerkId !== user.id);
    
    // Display logic based on user role
    const getDisplayInfo = () => {
        if (!otherUser) return { name: 'User', avatar: '👤', role: 'User' };
        
        if (currentUserRole === 'counselor') {
            // Counselors see students as anonymous
            return {
                name: 'Anonymous Student',
                avatar: '👤',
                role: 'Student (Anonymous)'
            };
        } else {
            // Students see counselor's real info
            return {
                name: otherUser.profile?.displayName || 'Professional Counselor',
                avatar: otherUser.profile?.displayName?.charAt(0) || '👩‍⚕️',
                role: 'Professional Counselor'
            };
        }
    };
    
    const displayInfo = getDisplayInfo();

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        
        // Handle typing indicators
        if (socket && !isTyping) {
            setIsTyping(true);
            socket.emit("typing", { room: conversation._id, userId: user?.id });
        }
        
        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            if (socket) {
                socket.emit("stop typing", { room: conversation._id, userId: user?.id });
                setIsTyping(false);
            }
        }, 1000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        // Stop typing when sending message
        if (socket && isTyping) {
            socket.emit("stop typing", { room: conversation._id, userId: user?.id });
            setIsTyping(false);
        }
        
        // Clear input immediately for responsive feel
        const messageToSend = newMessage;
        setNewMessage('');
        
        // Send message after clearing input
        onSendMessage(messageToSend);
    };

    return (
        <motion.main 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col glass-strong border border-white/20 dark:border-gray-700/20 rounded-3xl m-2 shadow-2xl min-h-0"
        >
            {/* Enhanced Header with Back Button - FIXED */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-4 border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20 flex-shrink-0"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Back Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                // Navigate to appropriate dashboard based on user role
                                if (currentUserRole === 'counselor') {
                                    router.push('/dashboard/counselor'); // This should work with (main) route group
                                } else {
                                    router.push('/counseling');
                                }
                            }}
                            className="w-10 h-10 rounded-full glass border border-white/30 dark:border-gray-600/30 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.button>
                        
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <motion.div 
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                                    currentUserRole === 'counselor' 
                                        ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
                                        : 'bg-gradient-to-r from-green-500 to-blue-500'
                                }`}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {displayInfo.avatar}
                            </motion.div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {displayInfo.name}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {displayInfo.role}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>
            
            {/* Messages Area - SCROLLABLE ONLY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scroll-smooth">
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ 
                                duration: 0.4, 
                                delay: index * 0.02,
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                            className={`flex items-end gap-3 ${msg.senderId?.clerkId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.senderId?.clerkId !== user?.id && (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                                    currentUserRole === 'counselor' 
                                        ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
                                        : 'bg-gradient-to-r from-green-500 to-blue-500'
                                }`}>
                                    {displayInfo.avatar}
                                </div>
                            )}
                            <div className="max-w-xs md:max-w-md">
                                <div
                                    className={`px-4 py-3 rounded-2xl relative ${
                                        msg.senderId?.clerkId === user?.id
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none'
                                            : 'glass text-gray-800 dark:text-white border border-white/20 rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className={`text-xs ${
                                            msg.senderId?.clerkId === user?.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                            {new Date(msg.createdAt || msg.timestamp || Date.now()).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        {msg.senderId?.clerkId === user?.id && (
                                            <CheckCircle className="w-3 h-3 text-blue-200" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                <AnimatePresence>
                    {typing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            <div className="flex space-x-1">
                                <motion.div
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                />
                                <motion.div
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                />
                                <motion.div
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                />
                            </div>
                            <span>Someone is typing...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Message Input - FIXED */}
            <motion.footer 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-4 border-t border-white/20 dark:border-gray-700/20 flex-shrink-0"
            >
                <form onSubmit={handleSubmit} className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-3 glass border-0 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:outline-none pr-20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                            >
                                <Smile className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            >
                                <Paperclip className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                    <motion.button
                        type="submit"
                        disabled={!newMessage.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl btn-interactive flex-shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </form>
            </motion.footer>
        </motion.main>
    );
};

// --- Main Page Component ---

export default function ChatLayoutPage({ params }) {
    const { user } = useUser();
    const { conversationId } = use(params);

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typing, setTyping] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    
    // Initialize Socket.IO connection
    const { socket, socketConnected } = useRealtimeSocket(user?.id, conversationId);

    // Fetch current user's role
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await fetch('/api/users/me');
                const userData = await res.json();
                setCurrentUserRole(userData.role);
            } catch (error) {
                console.error('Failed to fetch user role:', error);
            }
        };
        if (user) fetchUserRole();
    }, [user]);

    // Effect to fetch all conversations for the sidebar
    useEffect(() => {
        if (!user) return;
        const fetchConversations = async () => {
            try {
                const res = await fetch('/api/conversations');
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data);
                }
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            }
        };
        fetchConversations();
    }, [user]);

    // Effect to fetch the active chat's data and set up real-time listeners
    useEffect(() => {
        if (!user || !conversationId) return;

        setLoading(true);
        const fetchActiveChatData = async () => {
            try {
                const [convoRes, messagesRes] = await Promise.all([
                    fetch(`/api/conversations/${conversationId}`),
                    fetch(`/api/messages?conversationId=${conversationId}`)
                ]);

                if (!convoRes.ok || !messagesRes.ok) throw new Error("Failed to load chat data");
                
                const convoData = await convoRes.json();
                const messagesData = await messagesRes.json();
                
                setActiveConversation(convoData);
                setMessages(messagesData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveChatData();

    }, [user, conversationId]);

    // Set up real-time socket listeners
    useEffect(() => {
        if (!socket || !socketConnected) return;

        // Listen for new messages
        socket.on("message received", (newMessage) => {
            console.log("📨 New message received:", newMessage);
            setMessages(prev => {
                // Avoid duplicates by checking both _id and text+timestamp
                const exists = prev.some(msg => 
                    msg._id === newMessage._id || 
                    (msg.text === newMessage.text && Math.abs(new Date(msg.createdAt) - new Date(newMessage.createdAt)) < 1000)
                );
                if (exists) return prev;
                return [...prev, newMessage];
            });
        });

        // Listen for typing indicators
        socket.on("typing", (typingUserId) => {
            console.log("⌨️ Someone is typing...", typingUserId);
            // Only show typing indicator if it's not the current user
            if (typingUserId && typingUserId !== user?.id) {
                setTyping(true);
            }
        });

        socket.on("stop typing", (typingUserId) => {
            console.log("⌨️ Stopped typing", typingUserId);
            // Only hide typing indicator if it's not the current user
            if (typingUserId && typingUserId !== user?.id) {
                setTyping(false);
            }
        });

        // Listen for session end
        socket.on("session ended", ({ endedBy, userRole }) => {
            console.log(`🔚 Session ended by ${userRole}: ${endedBy}`);
            alert(`Chat session ended by ${userRole}`);
        });

        // Cleanup listeners
        return () => {
            socket.off("message received");
            socket.off("typing");
            socket.off("stop typing");
            socket.off("session ended");
        };
    }, [socket, socketConnected]);

    const handleSendMessage = async (text) => {
        if (!text.trim() || !user?.id || !socket) return;
        
        const optimisticMessage = { 
            _id: Date.now().toString(), 
            text, 
            senderId: { clerkId: user.id },
            createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, optimisticMessage]);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, text }),
            });
            
            if (!res.ok) throw new Error('Failed to send message.');
            
            const savedMessage = await res.json();
            
            // Emit the message via socket for real-time delivery
            socket.emit("new message", {
                chatId: conversationId,
                message: savedMessage
            });
            
            // Replace optimistic message with real one
            setMessages(prev => prev.map(msg => 
                msg._id === optimisticMessage._id ? savedMessage : msg
            ));
            
        } catch (error) {
            console.error(error);
            setMessages(prev => prev.filter(m => m._id !== optimisticMessage._id));
            alert('Error sending message.');
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-4rem)] gradient-hero dark:gradient-hero-dark flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-strong rounded-3xl p-8 text-center shadow-2xl"
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">Loading conversation...</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Secure & Private</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] gradient-hero dark:gradient-hero-dark transition-all duration-500 overflow-hidden flex flex-col m-0 p-0">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 right-10 w-32 h-32 bg-green-200/20 dark:bg-green-800/20 rounded-full blur-xl"
                    animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-60 left-20 w-24 h-24 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl"
                    animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div
                    className="absolute bottom-40 right-1/4 w-40 h-40 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-xl"
                    animate={{ y: [0, -25, 0], x: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
            </div>

            <div className="flex flex-1 relative z-10 min-h-0">
                <ConversationSidebar conversations={conversations} activeConversationId={conversationId} currentUserRole={currentUserRole} />
                <div className="flex-1 flex flex-col min-h-0">
                    {activeConversation ? (
                        <ChatWindow 
                            conversation={activeConversation}
                            messages={messages}
                            user={user}
                            onSendMessage={handleSendMessage}
                            socket={socket}
                            typing={typing}
                        />
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex h-full items-center justify-center p-8"
                        >
                            <div className="glass-strong rounded-3xl p-12 text-center shadow-2xl border border-white/20">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                    Welcome to Secure Counseling Chat
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Your conversation is encrypted and completely confidential.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                                    <Shield className="w-5 h-5" />
                                    <span className="text-sm font-medium">End-to-End Encrypted</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}