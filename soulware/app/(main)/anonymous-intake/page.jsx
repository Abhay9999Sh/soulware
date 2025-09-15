"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Video, MapPin, Clock, AlertCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function AnonymousIntake() {
  const { user } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    mode: "",
    counselorPreference: "any",
    urgency: ""
  });
  const [availableCounselors, setAvailableCounselors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available counselors
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await fetch("/api/profile/counselor");
        if (res.ok) {
          const data = await res.json();
          setAvailableCounselors(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching counselors:", error);
      }
    };

    fetchCounselors();
  }, []);

  const handleModeSelect = (mode) => {
    setForm(prev => ({ ...prev, mode }));
  };

  const handleCounselorSelect = (counselorId) => {
    setForm(prev => ({ ...prev, counselorPreference: counselorId }));
  };

  const handleUrgencySelect = (urgency) => {
    setForm(prev => ({ ...prev, urgency }));
  };

  const handleSubmit = async () => {
    if (!form.mode || !form.urgency) {
      alert("Please select both mode and urgency level");
      return;
    }

    setLoading(true);

    try {
      if (form.mode === "chat" && form.urgency === "now") {
        // Find available counselor for immediate chat
        const availableCounselor = availableCounselors.find(c => 
          form.counselorPreference === "any" || c.userId === form.counselorPreference
        ) || availableCounselors.find(c => c.userId === "user_32bl51bUU3I67QF6Y9V9nO1JwIT"); // Fallback to your specific counselor

        if (availableCounselor) {
          // Create immediate chat booking
          const bookingData = {
            counselorId: availableCounselor.userId,
            mode: "chat",
            slot: new Date().toISOString(),
            isAnonymous: true,
            studentId: user?.id,
            urgency: "immediate"
          };

          const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
          });

          const data = await res.json();

          if (data.success) {
            // Auto-accept the booking for immediate chat
            await fetch("/api/bookings", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: data.id,
                status: "accepted"
              }),
            });

            // Redirect to chat
            router.push(`/chat/${data.id}`);
          } else {
            throw new Error(data.error);
          }
        } else {
          // Show fallback option
          setShowFallback(true);
        }
      } else if (form.mode === "video" || form.mode === "in-person" || form.urgency === "later") {
        // Redirect to calendar booking
        router.push(`/book-session?mode=${form.mode}&counselor=${form.counselorPreference}`);
      }
    } catch (error) {
      console.error("Intake submission error:", error);
      alert("Error connecting to counselor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [showFallback, setShowFallback] = useState(false);

  if (showFallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-2xl border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                No Counselors Available Right Now
              </h3>
              <p className="text-gray-600 mb-6">
                All our counselors are currently busy. You can:
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push("/book-session")}
                  className="w-full"
                >
                  Schedule for Later
                </Button>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Phone className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Emergency Support</span>
                  </div>
                  <p className="text-sm text-green-700 mb-2">KIRAN Mental Health Helpline</p>
                  <p className="text-lg font-bold text-green-800">1800-599-0019</p>
                  <p className="text-xs text-green-600 mt-1">24/7 Free & Confidential</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Anonymous Counseling Support
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Quick and confidential mental health support. Just 3 simple steps.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Step 1: Mode Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                  Choose Your Preferred Mode
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <motion.div
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      form.mode === "chat" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelect("chat")}
                  >
                    <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-center mb-2">Chat Session</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Text-based counseling session
                    </p>
                  </motion.div>

                  <motion.div
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      form.mode === "video" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelect("video")}
                  >
                    <Video className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-center mb-2">Video Call</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Face-to-face video session
                    </p>
                  </motion.div>

                  <motion.div
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      form.mode === "in-person" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelect("in-person")}
                  >
                    <MapPin className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-center mb-2">In-Person</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Face-to-face at our center
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Step 2: Counselor Preference */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                  Counselor Preference (Optional)
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <motion.div
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      form.counselorPreference === "any" 
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                        : "border-gray-200 hover:border-green-300"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleCounselorSelect("any")}
                  >
                    <h3 className="font-semibold">Any Available Counselor</h3>
                    <p className="text-sm text-gray-600">Connect with the first available professional</p>
                  </motion.div>

                  {availableCounselors.map((counselor) => (
                    <motion.div
                      key={counselor._id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        form.counselorPreference === counselor.userId 
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleCounselorSelect(counselor.userId)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{counselor.name}</h3>
                          <p className="text-sm text-gray-600">{counselor.specialization} - {counselor.department}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          Available Now
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Step 3: Urgency */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
                  When do you need support?
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      form.urgency === "now" 
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                        : "border-gray-200 hover:border-red-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUrgencySelect("now")}
                  >
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-center mb-2">I Need Help Now</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Connect immediately with available counselor
                    </p>
                  </motion.div>

                  <motion.div
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      form.urgency === "later" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUrgencySelect("later")}
                  >
                    <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-center mb-2">Schedule for Later</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Book an appointment at a convenient time
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Button */}
          {form.mode && form.urgency && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <Button
                onClick={handleSubmit}
                disabled={loading}
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  "Connect to Counselor"
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                🔒 Your session will be completely anonymous and confidential
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
