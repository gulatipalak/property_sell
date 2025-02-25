const express = require("express")
const router= express.Router()
const authConroller = require("../../controller/user/authController")

router.route("/signup").post(authConroller.userSignup)

module.exports = router;

