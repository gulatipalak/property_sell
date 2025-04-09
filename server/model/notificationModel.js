const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // sender of the notification
        default: null, // null for system notifications
    },
    title: {
    type: String,
    required: true,
    },
    body: {
    type: String,
    required: true,
    },
    recipients: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
          },
          isSeen: {
            type: Boolean,
            default: false,
          },
        },
    ],
    notification_type: {
        type: String,
    },

},{timestamps:true});

module.exports = mongoose.model("notification",notificationSchema);