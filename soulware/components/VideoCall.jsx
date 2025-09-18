"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Users,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

export default function VideoCall({ bookingId }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const callFrameRef = useRef(null);
  const [callFrame, setCallFrame] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [participants, setParticipants] = useState({});
  const [localParticipant, setLocalParticipant] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("VideoCall component rendered with bookingId:", bookingId);
  console.log("User loaded:", isLoaded, "User:", user?.id);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console.log("Fetching booking for ID:", bookingId);
        const response = await fetch(`/api/bookings?bookingId=${bookingId}`);
        console.log("Booking response status:", response.status);
        
        if (response.ok) {
          const bookingData = await response.json();
          console.log("Booking data received:", bookingData);
          setBooking(bookingData);
        } else {
          throw new Error(`Failed to fetch booking: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError("Failed to load session details");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId && isLoaded) {
      fetchBooking();
    }
  }, [bookingId, isLoaded]);

  // Initialize Daily.co
  useEffect(() => {
    const initializeDaily = async () => {
      try {
        // Dynamically import Daily
        const Daily = (await import("@daily-co/daily-js")).default;
        
        if (!Daily) {
          throw new Error("Daily.co SDK not available");
        }

        // Create call frame
        const frame = Daily.createFrame(callFrameRef.current, {
          showLeaveButton: false, // We'll handle leave with our own button
          showFullscreenButton: true,
          showLocalVideo: true,
          showParticipantsBar: true,
          iframeStyle: {
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "12px",
          },
        });

        setCallFrame(frame);

        // Set up event listeners
        frame
          .on("joined-meeting", handleJoinedMeeting)
          .on("left-meeting", handleLeftMeeting)
          .on("participant-joined", handleParticipantJoined)
          .on("participant-left", handleParticipantLeft)
          .on("error", handleError)
          .on("camera-error", handleCameraError)
          .on("microphone-error", handleMicrophoneError);

        return () => {
          if (frame) {
            frame.destroy();
          }
        };
      } catch (error) {
        console.error("Error initializing Daily:", error);
        setError("Failed to initialize video call. Please try again.");
      }
    };

    initializeDaily();
  }, []);

  const handleJoinedMeeting = (event) => {
    console.log("Joined meeting:", event);
    setIsCallActive(true);
    setIsJoining(false);
    setLocalParticipant(event.participants.local);
  };

  const handleLeftMeeting = () => {
    console.log("Left meeting");
    setIsCallActive(false);
    setCallEnded(true);
    // Mark session as completed
    markSessionCompleted();
  };

  const handleParticipantJoined = (event) => {
    console.log("Participant joined:", event.participant);
    setParticipants(prev => ({
      ...prev,
      [event.participant.session_id]: event.participant
    }));
  };

  const handleParticipantLeft = (event) => {
    console.log("Participant left:", event.participant);
    setParticipants(prev => {
      const updated = { ...prev };
      delete updated[event.participant.session_id];
      return updated;
    });
  };

  const handleError = (error) => {
    console.error("Daily error:", error);
    setError("Video call error occurred. Please try again.");
  };

  const handleCameraError = (error) => {
    console.error("Camera error:", error);
    setError("Camera access denied. Please allow camera access and try again.");
  };

  const handleMicrophoneError = (error) => {
    console.error("Microphone error:", error);
    setError("Microphone access denied. Please allow microphone access and try again.");
  };

  const joinCall = async () => {
    if (!callFrame || !booking) return;

    setIsJoining(true);
    setError(null);

    try {
      // Create a room URL for this specific booking
      const roomResponse = await fetch("/api/video/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bookingId,
          studentId: booking.studentId,
          counselorId: booking.counselorId
        }),
      });

      const roomData = await roomResponse.json();
      
      if (!roomData.success) {
        throw new Error(roomData.error || "Failed to create video room");
      }

      // Join the Daily room
      await callFrame.join({
        url: roomData.roomUrl,
        userName: user?.firstName || "Anonymous",
        userData: {
          userId: user?.id,
          role: user?.id === booking.counselorId ? "counselor" : "student"
        }
      });

    } catch (error) {
      console.error("Error joining call:", error);
      setError(error.message || "Failed to join video call");
      setIsJoining(false);
    }
  };

  const leaveCall = async () => {
    if (callFrame) {
      await callFrame.leave();
    }
  };

  const toggleAudio = async () => {
    if (callFrame) {
      const newState = !isAudioEnabled;
      await callFrame.setLocalAudio(newState);
      setIsAudioEnabled(newState);
    }
  };

  const toggleVideo = async () => {
    if (callFrame) {
      const newState = !isVideoEnabled;
      await callFrame.setLocalVideo(newState);
      setIsVideoEnabled(newState);
    }
  };

  const markSessionCompleted = async () => {
    try {
      await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          status: "completed",
          updatedBy: user?.id,
        }),
      });
    } catch (error) {
      console.error("Error marking session as completed:", error);
    }
  };

  const goToDashboard = () => {
    const role = user?.id === booking?.counselorId ? "counselor" : "student";
    router.push(`/dashboard/${role}`);
  };

  // Show loading state while user or booking data is loading
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Video Call</h2>
          <p className="text-gray-600">Preparing your session...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="text-red-500 mb-4">
            <PhoneOff className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Call Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
            <Button
              onClick={goToDashboard}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="text-green-500 mb-4">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Call Ended Successfully</h2>
          <p className="text-gray-600 mb-6">
            Your video session has been completed. Thank you for using our counseling service.
          </p>
          <Button
            onClick={goToDashboard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Video Session
            </h1>
            {booking && (
              <div className="text-sm text-gray-600">
                with {user?.id === booking.counselorId 
                  ? "Student" 
                  : booking.counselorId?.firstName || "Counselor"
                }
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{Object.keys(participants).length + (localParticipant ? 1 : 0)} participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Call Container */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {!isCallActive ? (
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <div className="mb-6">
                <Video className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Ready to Start Video Call?
                </h2>
                <p className="text-gray-600">
                  Join the video session with your {user?.id === booking?.counselorId ? "student" : "counselor"}
                </p>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={joinCall}
                  disabled={isJoining || !booking}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  {isJoining ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5 mr-2" />
                      Join Video Call
                    </>
                  )}
                </Button>
                
                <div className="text-sm text-gray-500">
                  Make sure your camera and microphone are working
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Video Frame */}
              <div 
                ref={callFrameRef}
                className="w-full h-[calc(100vh-200px)] bg-gray-800 rounded-lg overflow-hidden"
              />
              
              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/70 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-3">
                  <Button
                    onClick={toggleAudio}
                    variant={isAudioEnabled ? "default" : "destructive"}
                    size="sm"
                    className="rounded-full w-12 h-12"
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    onClick={toggleVideo}
                    variant={isVideoEnabled ? "default" : "destructive"}
                    size="sm"
                    className="rounded-full w-12 h-12"
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    onClick={leaveCall}
                    variant="destructive"
                    size="sm"
                    className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
