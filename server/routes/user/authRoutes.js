const express = require("express")
const router= express.Router()
const authController = require("../../controller/user/authController")
const verifyToken = require("../../middleware/user/verifyToken")

router.route("/signup").post(authController.userSignup);
router.route("/verify-otp").post(authController.verifyOTP);
router.route("/resend-otp").post(authController.resendOTP);
router.route("/login").post(authController.login);
router.route("/forget-password").post(authController.forgetPassword);
router.route("/reset-password").post(authController.resetPassword);
router.route("/get-profile").get(verifyToken,authController.getProfile);

module.exports = router;

