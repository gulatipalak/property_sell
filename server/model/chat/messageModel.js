const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true,
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