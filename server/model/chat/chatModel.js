const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
        users:{
            type: [mongoose.Schema.ObjectId],
            ref: "user"
        },
        messageId:{
            type: mongoose.Schema.ObjectId,
            ref: "message"
        },
        isGroup:{
            type: Boolean,
            default: false
        }
}, { timestamps: true });

module.exports=mongoose.model("chat",chatSchema);