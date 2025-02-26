const userModel = require("../../model/user/authModel")
const bcrypt = require("bcrypt");
const sendEmail = require("../../services/email_services")

const generateOTP = () => Math.floor(1000 + Math.random () *9000)

exports.userSignup = async (req, res) => {
  const { username, email, password, phone_number, licence_number, role} = req.body;

  try {
    // ✅ Fix condition for checking empty fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ status: false, code: 400, message: "All fields are required" });
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

    const subject = "Your Signup OTP"
    const text = otp
    const html = ""

    await sendEmail(email,"Hello", "This is a test email", "<p>Test Email</p>")

    res.status(201).json({
      status: true,
      code: 201,
      message: "User successfully signed up",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ status: false, code: 500, message: "Internal Server Error" });
  }
};
