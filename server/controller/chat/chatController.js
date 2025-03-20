require("dotenv").config();
const userModel = require("../../model/user/authModel")

exports.allUsers = async (req, res) => {

  try {
    const users = await userModel.find();
    console.log(users);

    res.status(200).json({
      status: true,
      code: 200,
      message: "All Users",
      data: users
    });
  } catch (error) {
    res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
};

