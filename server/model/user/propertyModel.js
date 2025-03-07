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
    area: {
        type: Number,
        required: true,
        min: 1
    },
    postingFor: {
        type: String,
        required: true,
        enum: ["Sell","Rent"],
        default: "Sell"
    },
    type: {
        type: String,
        enum: ["Apartment","House","Shop","Office"]
    },
    location: {
        type: String,
    },
    price: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number
    },
    bathrooms: {
        type: Number
    },
    furnished: {
        type: String,
        enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"]
    },
    amenities: {
        type: [String]
    },
    image: {
        type: String,
    },
    approvalStatus: {
        type: String,
        enum: ["Pending","Approved","Rejected"],
        default: "Pending"
    }

},{timestamps: true});

module.exports = mongoose.model("property", propertySchema);