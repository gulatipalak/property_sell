const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.ObjectId,
        ref: "chat"
    },
    sender_id: {
        type: mongoose.Schema.ObjectId,
        require: true,
    },
    receiver_id: {
        type: mongoose.Schema.ObjectId,
    },
    message: {
        type: String,
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