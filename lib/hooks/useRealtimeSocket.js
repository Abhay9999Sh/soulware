"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
let socket;

export const useRealtimeSocket = (userId, chatId) => {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // Hit the API route once to spin up the Socket.IO server
        await fetch("/api/socket");

        // Connect to socket.io
        socket = io(ENDPOINT, {
          transports: ["websocket"],
        });

        socket.on("connect", () => {
          console.log("✅ Connected to socket.io");
          setSocketConnected(true);

          // Setup userId (so each socket belongs to a user)
          if (userId) {
            socket.emit("setup", { userId });
            console.log("🔗 Setup done for user:", userId);
          }

          // Join chat room (so both counselor & student are in same room)
          if (chatId) {
            socket.emit("join chat", chatId);
            console.log("📌 Joined chat room:", chatId);
          }
        });

        socket.on("disconnect", () => {
          console.log("❌ Disconnected from socket.io");
          setSocketConnected(false);
        });

        socket.on("connect_error", (error) => {
          console.error("⚠️ Socket connection error:", error);
          setSocketConnected(false);
        });
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    };

    initializeSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [userId, chatId]); // re-run if user or chat changes

  return { socket, socketConnected };
};
