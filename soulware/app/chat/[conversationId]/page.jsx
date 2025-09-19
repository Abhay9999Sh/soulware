"use client";

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Send, Loader, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// --- Sub-components for the new layout ---

const ConversationSidebar = ({ conversations, activeConversationId }) => (
    <aside className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold">Chats</h1>
        </div>
        <div className="overflow-y-auto flex-1">
            {conversations.map(convo => {
                const otherUser = convo.otherParticipant;
                return (
                    <Link href={`/chat/${convo._id}`} key={convo._id}>
                        <div className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${activeConversationId === convo._id ? 'bg-blue-50 dark:bg-gray-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                {otherUser?.profile?.displayName?.charAt(0) || <UserIcon />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold truncate">{otherUser?.profile?.displayName}</p>
                                <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    </aside>
);

const ChatWindow = ({ conversation, messages, user, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const otherUser = conversation.participants.find(p => p.clerkId !== user.id);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
    };

    return (
        <main className="flex-1 flex flex-col">
            <header className="bg-white dark:bg-gray-800 shadow p-4 z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                    {otherUser?.profile?.displayName?.charAt(0) || <UserIcon />}
                </div>
                <h2 className="text-xl font-bold">{otherUser?.profile?.displayName || 'User'}</h2>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-end gap-2 ${msg.senderId.clerkId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.senderId.clerkId === user.id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <footer className="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 w-full px-4 py-2 border rounded-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition disabled:opacity-50" disabled={!newMessage.trim()}>
                        <Send size={20} />
                    </button>
                </form>
            </footer>
        </main>
    );
};

// --- Main Page Component ---

export default function ChatLayoutPage({ params }) {
    const { user } = useUser();
    const { conversationId } = params;

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Effect to fetch the active chat's data and set up polling
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
        
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/messages?conversationId=${conversationId}`);
                const data = await res.json();
                setMessages(data);
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000);

        return () => clearInterval(interval);

    }, [user, conversationId]);

    const handleSendMessage = async (text) => {
        if (!text.trim() || !user) return;
        const optimisticMessage = { _id: Date.now().toString(), text, senderId: { clerkId: user.id } };
        setMessages((prev) => [...prev, optimisticMessage]);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, text }),
            });
            if (!res.ok) throw new Error('Failed to send message.');
        } catch (error) {
            console.error(error);
            setMessages(prev => prev.filter(m => m._id !== optimisticMessage._id));
            alert('Error sending message.');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <ConversationSidebar conversations={conversations} activeConversationId={conversationId} />
            <div className="flex-1 flex flex-col">
                {loading ? (
                    <div className="flex h-full items-center justify-center"><Loader className="animate-spin" /></div>
                ) : activeConversation ? (
                    <ChatWindow 
                        conversation={activeConversation}
                        messages={messages}
                        user={user}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-500">Select a conversation to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}