const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/user/authRoutes")
const landlordRoutes = require("./routes/user/landlordRoutes")
const chatRoutes = require("./routes/chat/chatRoutes")
const http = require("http");
const { Server } = require("socket.io");

//initialize express app
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Enable CORS for frontend connection
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Allow frontend to connect (Change if needed)
      methods: ["GET", "POST"]
    }
  });


// Listen for new client connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id); // Log when a user connects
  
    // Listen for a 'user-login' event from frontend
    socket.on("user-login", (userId) => {
      console.log(`User logged in: ${userId}`);
      socket.join(userId); // The user joins a unique room with their user ID
    });
  
    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

//Middlewares
app.use(express.json())//Parse json bodies -  we don't need body-parser 
app.use(cors()) //Enable cors
app.use(express.urlencoded({extended:true}))
require("./db/db")

app.get("/",(req,res)=>{
    res.send("Hello world console")
})
app.use("/api/v1/user",authRoutes);
app.use("/api/v1/user/landlord",landlordRoutes);
app.use("/api/v1/chat/",chatRoutes);

server.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})