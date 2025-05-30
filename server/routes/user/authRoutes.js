const express = require("express")
const router= express.Router()
const authController = require("../../controller/user/authController")
const verifyToken = require("../../middleware/user/verifyToken")
const upload = require("../../middleware/user/multer")

router.route("/signup").post(authController.userSignup);
router.route("/verify-otp").post(authController.verifyOTP);
router.route("/resend-otp").post(authController.resendOTP);
router.route("/login").post(authController.login);
router.route("/save-device-token").post(verifyToken,authController.saveDeviceToken);
router.route("/remove-device-token").post(verifyToken,authController.removeDeviceToken);
router.route("/forget-password").post(authController.forgetPassword);
router.route("/reset-password").post(authController.resetPassword);
router.route("/get-profile").get(verifyToken,authController.getProfile);
router.route("/update-profile").patch(verifyToken,upload.single("profile_photo"),authController.updateProfile)

module.exports = router;

