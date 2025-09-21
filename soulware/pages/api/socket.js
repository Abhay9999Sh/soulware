import { Server } from "socket.io";

let io; // shared instance

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized yet");
  }
  return io;
}

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.IO...");

    io = new Server(res.socket.server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3000", // change in prod
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      socket.on("setup", (userData) => {
        if (userData?.userId) {
          socket.join(userData.userId);
          socket.emit("connected");
          console.log("User setup:", userData.userId);
        }
      });

      socket.on("join chat", (room) => {
        if (room) {
          socket.join(room);
          console.log("User joined room:", room);
        }
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("new message", ({ chatId, message }) => {
        if (!chatId) return console.log("chatId not defined");
        io.in(chatId).emit("message received", message); // send to all in room
        console.log("Message broadcasted to:", chatId);
      });

      socket.on("end session", ({ chatId, endedBy, userRole }) => {
        if (!chatId) return console.log("chatId not defined for session end");
        socket.to(chatId).emit("session ended", { endedBy, userRole }); // send to other users in room
        console.log(`Session ended for chat: ${chatId} by ${userRole}: ${endedBy}`);
      });

      socket.on("disconnect", () => console.log("❌ User disconnected"));
      socket.on("error", (error) => console.error("⚠️ Socket error:", error));
    });
  } else {
    io = res.socket.server.io; // reuse existing
    console.log("♻️ Socket.IO already running");
  }

  res.end();
}
