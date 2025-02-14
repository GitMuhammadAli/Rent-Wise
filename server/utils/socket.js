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
const connectedUsers = []


io.on("connection", (socket) => {
    socket.on("join-user", (userId) => {
      socket.join(userId.toString());
      if (!connectedUsers.some((id) => id === userId)) {
        connectedUsers.push(userId); 
      }
      console.log(`✅ User ${userId} joined room ${userId.toString()}`);
      console.log("online users are " , connectedUsers )
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


  socket.on("leave-user", (userId) => {
    const index = connectedUsers.indexOf(userId);
  if (index !== -1) {
    connectedUsers.splice(index, 1);
  }
    socket.leave(userId);
    console.log(`❌ User ${userId} left. Updated online users:`, connectedUsers);
  });


    // Disconnect
    socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
    });
});


module.exports = { server, io, app , connectedUsers };