const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const messageModel = require("../model/chat/messageModel");
const app = express();
const server = http.createServer(app);

// Enable CORS for frontend connection
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Allow frontend to connect (Change if needed)
      methods: ["GET", "POST"]
    }
  });

const onlineUsers = {};
  
const getReceiverSocketId = (receiverId) =>{
    return onlineUsers[receiverId];
}

// Listen for new client connections
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id); // Log when a user connects

     // Save user connection
    socket.on("join", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
    });

    // Listen for a 'user-login' event from frontend
    socket.on("user-login", (userId, username) => {
      console.log(`User logged in: ${userId} ${username}`);
      socket.emit("user-login",socket.id);
    });

    socket.on("typing",(typingUserId,typingUsername,receiverId) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("receiversocketId",receiverSocketId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("typing",typingUserId,typingUsername);
        }
    })

    socket?.on("stop-typing",(typingUserId,receiverId) => {
      const receiverSocketId = getReceiverSocketId(receiverId);
      console.log("receiversocketId",receiverSocketId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopped-typing",typingUserId);
      }
    });

    socket.on("messages-read",async (userId,selecteduserId)=>{
        try {
          await messageModel.updateMany({senderId:selecteduserId,receiverId:userId},{$set: {isRead: true}});
          const receiverSocketId = getReceiverSocketId(selecteduserId);
          if(receiverSocketId) {
            io.to(receiverSocketId).emit("read-marked",userId);
          }

        } catch (error) {
          console.log("Error in read messages: ", error);
        }
    })
  
    // Handle user disconnection
    socket.on("user-disconnect", (userId,username) => {
       delete onlineUsers[userId];
        console.log(`User disconnected (Socket id): ${socket.id}`);
        console.log(`User disconnected (user id): ${userId}`);
        console.log(`User disconnected (user name): ${username}`);
    });
  });

  module.exports = { app, server, io , getReceiverSocketId };