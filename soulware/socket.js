// This file should be in the root of your project
const { Server } = require("socket.io");

const io = new Server(3001, { // Running on a different port from the main app
  cors: {
    origin: "http://localhost:3000", // Allow your Next.js app to connect
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user joins a specific chat room (bookingId)
  socket.on("join-room", (bookingId) => {
    socket.join(bookingId);
    console.log(`User ${socket.id} joined room ${bookingId}`);
  });

  // When a message is sent from the client
  socket.on("send-message", ({ bookingId, message }) => {
    // Broadcast the message to all other clients in the same room
    socket.to(bookingId).emit("receive-message", message);
    console.log(`Message sent in room ${bookingId}:`, message.text);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

console.log("Socket.IO server running on port 3001");

