require("dotenv").config();
const userModel = require("../../model/user/authModel")
const chatModel = require("../../model/chat/chatModel")
const messageModel = require("../../model/chat/messageModel")

exports.allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password") ;

    if (users.length === 0) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "No users found",
      });
    }

    res.status(200).json({
      status: true,
      code: 200,
      message: "All Users",
      data: users
    });
  } catch (error) {
    res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await userModel.findById(userid);

    if (!user) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      code: 200,
      message: "User",
      data: user
    });
  } catch (error) {
    return res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await userModel.findById(userid);

    if (!user) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      code: 200,
      message: "User",
      data: user
    });
  } catch (error) {
    return res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
};

exports.fetchMessages = async (req, res) => {
  try {
    const senderId = req.user.id;
    const recieverId = req.params.id;
    // console.log("Sender id: ",senderId);
    // console.log("Receiver id: ",recieverId);

    const chat = await chatModel.findOne({ users: { $all: [senderId, recieverId] } });
    // console.log("chat: ",chat);

    if (!chat) {
      return res.status(404).json({ status: false, message: "Chat not found" });
    }

    const messages = await messageModel.find({ chatId: chat._id }).sort("createdAt");

    return res.status(200).json({message:"messages sent",messages});

  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
};

exports.sendMessage = async(req,res) => {
  try {
    const senderId = req.user.id;
    const {message} = req.body;
    const receiverId = req.params.id;

    if (!message) {
      return res.status(400).json({ status: false, message: "Message content is required" });
    }

    let chat = await chatModel.findOne({ users: { $all: [senderId, receiverId] } });

    // If no chat exists, create a new chat
    if (!chat) {
      chat = await chatModel.create({ users: [senderId, receiverId] });
    }

    // Save the message
    const newMessage = new messageModel({
      chatId: chat._id,
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      timestamp: new Date()
    });

    await newMessage.save();
    return res.status(201).json({ status: true, message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
}







