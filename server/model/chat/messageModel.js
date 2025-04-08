const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"chat",
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    text: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ["text","video","file","image"],
        default: "text",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
},{timestamps:true}
);


module.exports= mongoose.model("message",messageSchema);