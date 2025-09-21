"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { User, Database, Shield, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function DebugRolePage() {
    const { user, isLoaded } = useUser();
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetch('/api/users/me');
            const data = await res.json();
            
            if (res.ok) {
                setDbUser(data);
                console.log("🔍 Debug - User data:", data);
            } else {
                setError(data.error || 'Failed to fetch user data');
            }
        } catch (err) {
            setError(err.message);
            console.error("❌ Debug - Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchUserData();
        }
    }, [isLoaded, user]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p>Loading Clerk user...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h2 className="text-xl font-bold mb-2">Not Signed In</h2>
                    <p>Please sign in to debug your role.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 mb-8"
                >
                
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-blue-600" />
                        Role Debug Information
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Clerk User Info */}
                        <div className="bg-white/20 dark:bg-gray-700/20 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-green-600" />
                                Clerk User Data
                            </h2>
                            <div className="space-y-2 text-sm">
                                <p><strong>ID:</strong> {user.id}</p>
                                <p><strong>Email:</strong> {user.emailAddresses?.[0]?.emailAddress}</p>
                                <p><strong>Name:</strong> {user.fullName || user.firstName}</p>
                                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Database User Info */}
                        <div className="bg-white/20 dark:bg-gray-700/20 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-purple-600" />
                                Database User Data
                                <button
                                    onClick={fetchUserData}
                                    disabled={loading}
                                    className="ml-auto p-1 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </h2>
                            
                            {loading ? (
                                <div className="text-center py-4">
                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Fetching...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-4">
                                    <XCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            ) : dbUser ? (
                                <div className="space-y-2 text-sm">
                                    <p><strong>Role:</strong> 
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                            dbUser.role === 'counselor' ? 'bg-green-100 text-green-800' :
                                            dbUser.role === 'student' ? 'bg-blue-100 text-blue-800' :
                                            dbUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {dbUser.role}
                                        </span>
                                    </p>
                                    <p><strong>Email:</strong> {dbUser.email}</p>
                                    <p><strong>Name:</strong> {dbUser.name}</p>
                                    {dbUser.department && <p><strong>Department:</strong> {dbUser.department}</p>}
                                    {dbUser.specialization && <p><strong>Specialization:</strong> {dbUser.specialization}</p>}
                                    <p><strong>Updated:</strong> {new Date(dbUser.updatedAt).toLocaleString()}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-400">No database user found</p>
                            )}
                        </div>
                    </div>

                    {/* Role Status */}
                    <div className="mt-6 p-4 rounded-2xl bg-white/20 dark:bg-gray-700/20">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Dashboard Access Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { role: 'student', path: '/dashboard/student', color: 'blue' },
                                { role: 'counselor', path: '/dashboard/counselor', color: 'green' },
                                { role: 'admin', path: '/dashboard/admin', color: 'purple' }
                            ].map((dashboard) => (
                                <div key={dashboard.role} className={`p-3 rounded-xl border-2 ${
                                    dbUser?.role === dashboard.role 
                                        ? dashboard.color === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                                          dashboard.color === 'green' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                                          'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/20'
                                }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {dbUser?.role === dashboard.role ? (
                                            <CheckCircle className={`w-5 h-5 ${
                                                dashboard.color === 'blue' ? 'text-blue-600' :
                                                dashboard.color === 'green' ? 'text-green-600' :
                                                'text-purple-600'
                                            }`} />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-gray-400" />
                                        )}
                                        <span className="font-semibold capitalize">{dashboard.role}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{dashboard.path}</p>
                                    {dbUser?.role === dashboard.role && (
                                        <a 
                                            href={dashboard.path}
                                            className={`inline-block mt-2 px-3 py-1 text-white text-xs rounded-lg transition-colors ${
                                                dashboard.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                                                dashboard.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                                                'bg-purple-600 hover:bg-purple-700'
                                            }`}
                                        >
                                            Access Dashboard
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">Troubleshooting</h3>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                            <li>• If your role is "student" but you should be a "counselor", check if you exist in the counselors collection</li>
                            <li>• The system first checks the users collection, then the counselors collection</li>
                            <li>• If found in counselors, your role gets set to "counselor"</li>
                            <li>• Otherwise, it defaults to "student"</li>
                            <li>• Click the refresh button to re-fetch your role data</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
