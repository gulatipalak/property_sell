require("dotenv").config();
const userModel = require("../../model/user/authModel")

exports.allUsers = async (req, res) => {

  try {
    const users = await userModel.find({}, "-password") ;

    if (users.length === 0) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "No users found",
      });
    }

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

exports.getUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await userModel.findById(userid);

    if (!user) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      code: 200,
      message: "User",
      data: user
    });
  } catch (error) {
    return res.status(500).json({ status: false, code: 500, message:"Internal Server Error" });
  }
};

