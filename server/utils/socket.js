const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
    },
});

const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Join specific rooms for each user
        socket.on("joinRoom", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = {
    io,
    setupSocket
}