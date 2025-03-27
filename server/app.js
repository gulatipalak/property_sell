const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/user/authRoutes")
const landlordRoutes = require("./routes/user/landlordRoutes")
const chatRoutes = require("./routes/chat/chatRoutes")
const {app, server} = require("./lib/socket")


//initialize express app
const PORT = process.env.PORT || 3000;

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
app.use("/api/v1/chat",chatRoutes);

server.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})