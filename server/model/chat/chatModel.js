const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "user",
        required: true
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"message"
    },
},{timestamps:true});

module.exports = mongoose.model("chat",chatSchema);