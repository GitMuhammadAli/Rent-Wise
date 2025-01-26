// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "*", // Allow all origins (modify in production for security)
//         methods: ["GET", "POST"],
//     },
// });

// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     // Listen for user joining a conversation room
//     socket.on("join-conversation", (roomId) => {
//         socket.join(roomId);
//         console.log(`User ${socket.id} joined room: ${roomId}`);
//     });

//     // Listen for a new message and broadcast it
//     socket.on("sendMessage", (data) => {
//         io.to(data.conversationId).emit("newMessage", data);
//         console.log("Message sent:", data);
//     });

//     // Handle user disconnect
//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
// });

// module.exports = { server, io , app};

const express = require("express");
const app = express();

const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,  // Adjust this based on your frontend's URL
    methods: ["GET", "POST"],
  },
});

// Handle Socket.IO connections
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("connect", () => {
//     console.log("Socket connected:", socket.id);
//   });


//   socket.on("join-conversation", (conversationId) => {
//     console.log(`[Backend] Socket ${socket.id} is joining room: ${conversationId}`);
//     socket.join(conversationId);
//     console.log(`Socket rooms after join:`, Array.from(socket.rooms)); // 
//   });



//   socket.on("send-message", async (data) => {
//     const { conversationId, message, sender, receiver } = data;
//     console.log("Received message data:", data);
//     if (conversationId && message) {
//       io.to(conversationId).emit("receiveMessage", data);
//     } else {
//       console.error("Invalid message data:", data);
//     }
//   });

//   socket.on("leave-conversation", (conversationId) => {
//     socket.leave(conversationId);
//     console.log(`User left conversation: ${conversationId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);


  // ================== CHAT SOCKET EVENTS ==================

  // Join a conversation room
  socket.on("join-conversation", (conversationId) => {
    console.log(`========================[Socket.IO] User ${socket.id} joining room ${conversationId}`);
    socket.join(conversationId);
  });

  // Leave a conversation room
  socket.on("leave-conversation", (conversationId) => {
    console.log(`[Socket.IO] User ${socket.id} leaving room ${conversationId}`);
    socket.leave(conversationId);
  });



  // ================== NOTIFICATION SOCKET EVENTS ==================

  // Send notification
  socket.on("sendNotification", async ({ recipient, sender, type, message, listing }) => {
    console.log(`[Notification] Sending notification to user: ${recipient}`);

    const notification = new Notification({ recipient, sender, type, message, listing });
    await notification.save();

    io.to(recipient).emit("receiveNotification", notification);
  });

  // Mark notification as read
  socket.on("markAsRead", async ({ notificationId }) => {
    console.log(`[Notification] Marking notification as read: ${notificationId}`);
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
  });


  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


module.exports = { server, io, app };