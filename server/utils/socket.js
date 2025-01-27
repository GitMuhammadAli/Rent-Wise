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

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);


    socket.on("join-user", (userId) => {
      if (typeof userId === 'object') {
          userId = userId._id;
      }
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

    // Disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


module.exports = { server, io , app};