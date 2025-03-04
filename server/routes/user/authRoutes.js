const express = require("express")
const router= express.Router()
const authConroller = require("../../controller/user/authController")

router.route("/signup").post(authConroller.userSignup);
router.route("/verify-otp").post(authConroller.verifyOTP);
router.route("/resend-otp").post(authConroller.resendOTP);
router.route("/login").post(authConroller.login);
router.route("/forget-password").post(authConroller.forgetPassword);
router.route("/reset-password").post(authConroller.resetPassword);
router.route("/dashboard").get(authConroller.getProfile);

module.exports = router;

