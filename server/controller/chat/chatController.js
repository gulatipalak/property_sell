require("dotenv").config();
const userModel = require("../../model/user/authModel")
const messageModel = require("../../model/chat/messageModel")
const {getReceiverSocketId ,io} = require("../../lib/socket");
const chatModel = require("../../model/chat/chatModel");

exports.chatUsers = async (req, res) => {
  try {
    const myId = req.user.id;
    const users = await chatModel.find({users:{$in:[myId]}}).populate({path: "users", select: "username"});

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

exports.getMessages = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    const messages = await messageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 }); // Sort messages from oldest to newest

    // console.log(messages);

    return res.status(200).json({messages});

  } catch (error) {
    console.error("Error in getMessages controller:", error);
    return res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
};

exports.sendMessage = async(req,res) => {
  try {
    const senderId = req.user.id;
    const {text} = req.body;
    const receiverId = req.params.id;

    // console.log(`sender: ${senderId},text: ${text},receiver: ${receiverId}`)

    if (!text) {
      return res.status(400).json({ status: false, message: "Message content is required" });
    }

    let chat = await chatModel.findOne({users:{$all:[senderId,receiverId]}});

    if(!chat){
        chat = new chatModel({
          users:[senderId,receiverId]
        })
        await chat.save();
    }

    const chatId = chat._id;

    // Save the message
    const newMessage = new messageModel({
      chatId: chatId,
      senderId: senderId,
      receiverId: receiverId,
      text,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json({ status: true, message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    return res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
}







