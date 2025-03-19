require("dotenv").config();
const userModel = require("../../model/user/authModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../services/email_services")
const generateOTP = require("../../utils/generate_otp")

exports.userSignup = async (req, res) => {
  const { username, email, password, phone_number, licence_number, role} = req.body;

  try {
    // ✅ Fix condition for checking empty fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ status: false, code: 400, message: "All fields are required." });
    }

    // ✅ Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: false, code: 409, message: "User already exists" });
    }

    // ✅ Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP()
    // ✅ Save new user
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      role,
      phone_number,
      licence_number,
      otp
    });

    await newUser.save();

    const subject = "Your Signup OTP";
    const text = `Your OTP is ${otp}`;
    const html = `<p>Your OTP is <strong>${otp}</strong></p>`

    try {
      await sendEmail(email, subject ,text, html);
    } 
    catch(emailError) {
      console.log("Email sending failed:", emailError);
      
      res.status(201).json({
        status: true,
        code: 201,
        message: "Signup successful, but OTP email failed. Please request OTP again.",
      })
    }

    res.status(201).json({
      status: true,
      code: 201,
      message: "Signup successful. OTP sent to your email.",
      email,
      role
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
};

exports.verifyOTP = async (req,res) => {
  const {email, otp} = req.body;
    // console.log (req.body);
    try {
      const user = await userModel.findOne({email});

      if(!user) {
        return res.status(400).json({status:false ,code:400 , message:"User not found."});
      }

      if(user.otp !== otp){
        return res.status(400).json({status:false, code: 400, message:"Incorrect OTP"});
      }

      await userModel.updateOne({email},{$set:{ otp: 1 }});

      const token = jwt.sign(
        {id:user._id, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
      );

      return res.status(200).json({ 
      status: true, 
      code: 200, 
      message: "OTP Verified Successfully!",
      token,
      email,
      role: user.role,
    });

    } catch(error){
      console.log("Verify OTP Error: ", error);
      return res.status(500).json({status:false, code: 500, message:"Internal Server Error"});
    }
};

exports.resendOTP = async (req,res) => {
   const {email} = req.body;
  //  console.log (req.body);
   try {
    const user =await userModel.findOne({email});

    if (!user) {
      return res.status(400).json({status: false, code: 400, message: "User not found."});
    }
    const newOTP = generateOTP();
    await userModel.updateOne({email},{$set: {otp: newOTP,}});

    const subject = "Your New OTP";
    const text = `Your OTP is ${newOTP}`;
    const html = `<p>Your OTP is <strong>${newOTP}</strong></p>`

    try {
      await sendEmail(email, subject ,text, html);
      return res.status(200).json({ status: true, code: 200, message: "OTP resent successfully. Please check your email." });
    } catch(emailError) {
      console.log("Email sending failed:", emailError);
      return res.status(500).json({ status: false, code: 500, message: "OTP resend failed. Try again later." });
    }

   } catch (error) {
      console.log("Resend OTP Error: ", error);
     return res.status(500).json({status: false, code: 500, message:"Internal Server Error"});
   }
};

exports.login = async (req,res) => {
  const {email, password} = req.body;

  try {
    const user = await userModel.findOne({email});
    if(!user) {
      return res.status(400).json({status: false, code: 400, message:"User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(400).json({status: false, code: 400, message:"Invalid Credentials"});
    }

    if(user.otp !== 1) {
      return res.status(400).json({status: false, code: 'EMAIL_NOT_VERIFIED', message: "Access Denied: Verify Your Email.",email});
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret Key from .env
      { expiresIn: "7d" } // Token expires in 7 days
    );

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Login Successful!",
      token,
      email,
      role: user.role
    });
  }
  catch(error){
    console.error("Login Error:", error);
    return res.status(500).json({status: false, code: 500, message: "Internal Server Error"});
  }
};

exports.forgetPassword = async (req,res) => {
    const { email }= req.body;

    try {
      const user = await userModel.findOne({email});

      if(!user) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: "User not found"
        });
      }

      const OTP = generateOTP();

      await userModel.updateOne({email},{$set: {otp: OTP}});

      const subject = "Your OTP";
      const text = `Your OTP is ${OTP}`;
      const html = `<p>Your OTP is <strong>${OTP}</strong></p>`

      try {
        await sendEmail(email, subject, text, html);
        return res.status(200).json({
          status: true,
          code: 200,
          message: "OTP sent. Please check your email.",
          email
        });
      } catch (error) {
        return res.status(500).json({
          status: false,
          code: 500,
          message: "Failed to send email. Please try Resending the OTP."
        });
      }

    }
    catch (error) {
      console.log("Verify Email Error: ", error);
      return res.status(500).json({
        status: false,
        code: 500,
        message: "Internal Server Error",
      })
    }
};

exports.resetPassword = async (req,res) => {
  const {email,password} = req.body;

  try{
    const user = await userModel.findOne({email});

    if(!user) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "User not found"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    await userModel.updateOne({email},{$set: {password: hashedPassword}});

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Password reset successfully! Please login."
    });

  }catch (error) {
    console.log("Failed to reset password: ", error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal Server Error",
    })
  }
}

exports.getProfile= async (req,res) => {
  const {id} = req.user;

  try {
  const user = await userModel.findById(id).select("-password");

  if(!user) return res.status(404).json({status: false, code: 404, message: "User not found."});

  return res.status(200).json({
    status: true,
    code: 200,
    message: "Profile retrieved successfully",
    data: user,
  });
  }catch (error) {
    return res.status(500).json({status: false, code: 500, message: "Internal Server Error"});
  }
}

exports.updateProfile = async (req,res) => {
    try {
      const {id} = req.user;
      const formData = req.body;

      const updateUser = await userModel.findByIdAndUpdate(id,formData,{new: true});

      return res.status(200).json({
        status: true,
        code: 200,
        message: "Profile Updated Successfully!",
        data: updateUser,
      })
    }
    catch (error) {
      return res.status(500).json({status: false, code: 500, meassage: "Internal Server Error"});
    }
}
