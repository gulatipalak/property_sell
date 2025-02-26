const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_status: {
        type: String,
        enum: ["active","inactive","deleted"],
        default: "active"
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique:true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number:{
        type: String,
    },
    otp: {
        type: Number
    },
    profile_photo:{
        type: String
    },
    licence_number: {
        type: String
    },
    role:{
        type:String,
        enum:["tenant","landlord"],
        required: true
    }
});

module.exports=mongoose.model("user",userSchema);