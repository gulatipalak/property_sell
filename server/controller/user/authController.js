const userModel = require("../../model/user/authModel")
const bcrypt = require("bcrypt");

exports.userSignup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // ✅ Fix condition for checking empty fields
    if (!username || !email || !password) {
      return res.status(400).json({ status: false, code: 400, message: "All fields are required" });
    }

    // ✅ Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: false, code: 409, message: "User already exists" });
    }

    // ✅ Hash the password before saving
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Save new user
    const newUser = new userModel({
      username,
      email,
      password, // Save hashed password
    });

    await newUser.save();

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
