const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    userId:{
       type: mongoose.Schema.ObjectId,
       ref: "user",
       required:true
    },
    property_name: {
        type: String,
        required: true
    },
    postingFor: {
        type: String,
        required: true,
        enum: ["Sell","Rent"]
    },
    type: {
        type: String,
        enum: ["Apartment","House","Shop","office"]
    },
    location: {
        type: String,
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
    }

},{timestamps: true});

module.exports = mongoose.model("property", propertySchema);