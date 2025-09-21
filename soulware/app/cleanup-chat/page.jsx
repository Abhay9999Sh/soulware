"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Database, RefreshCw } from "lucide-react";

export default function CleanupChatPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/cleanup-chat');
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error fetching stats: ${error.message}`);
        }
    };

    const clearDatabase = async () => {
        if (!confirm('Are you sure you want to clear ALL chat data? This cannot be undone!')) {
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/cleanup-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            
            if (res.ok) {
                setMessage(`✅ Success! Deleted ${data.deleted.conversations} conversations and ${data.deleted.messages} messages`);
                // Refresh stats after cleanup
                setTimeout(fetchStats, 1000);
            } else {
                setMessage(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-hero dark:gradient-hero-dark p-8">
            <div className="max-w-2xl mx-auto">
                <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Database className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Chat Database Cleanup
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Clear all conversations and messages for a fresh start
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Stats Section */}
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Current Database Stats
                                </h3>
                                <Button 
                                    onClick={fetchStats}
                                    variant="outline"
                                    size="sm"
                                    className="glass border-white/20"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                            
                            {stats ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 glass rounded-xl">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {stats.conversations}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Conversations
                                        </div>
                                    </div>
                                    <div className="text-center p-4 glass rounded-xl">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {stats.messages}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Messages
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Button onClick={fetchStats} variant="outline" className="glass border-white/20">
                                        Load Stats
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Cleanup Section */}
                        <div className="glass rounded-2xl p-6 border border-red-200/50 dark:border-red-800/50">
                            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4">
                                ⚠️ Danger Zone
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                This will permanently delete all conversations and messages. 
                                This action cannot be undone!
                            </p>
                            <Button 
                                onClick={clearDatabase}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Clearing Database...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear All Chat Data
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Message Display */}
                        {message && (
                            <div className={`glass rounded-2xl p-4 ${
                                message.includes('✅') 
                                    ? 'border border-green-200/50 dark:border-green-800/50' 
                                    : 'border border-red-200/50 dark:border-red-800/50'
                            }`}>
                                <p className={`font-medium ${
                                    message.includes('✅') 
                                        ? 'text-green-700 dark:text-green-300' 
                                        : 'text-red-700 dark:text-red-300'
                                }`}>
                                    {message}
                                </p>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="text-center">
                            <Button 
                                onClick={() => window.location.href = '/counseling'}
                                variant="outline"
                                className="glass border-white/20"
                            >
                                Back to Counseling
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
