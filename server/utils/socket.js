const express = require("express");
const app = express();

const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,  // Adjust this based on your frontend's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true // This allows cookies to be sent
  }
});
const onlineUsers = new Map();

console.log("online users are " , onlineUsers )


io.on("connection", (socket) => {
    // console.log("A user connected:", socket.id);
    socket.on("join-user", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId.toString());
      console.log(`✅ User ${userId} joined room ${userId.toString()}`);
  });
  
  
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
        // console.log("User disconnected:", socket.id);
    });
});


module.exports = { server, io, app };