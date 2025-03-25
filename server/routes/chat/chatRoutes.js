const express = require("express")
const router= express.Router()
const chatController = require("../../controller/chat/chatController")
const verifyToken = require("../../middleware/user/verifyToken")

router.route("/all-users").get(verifyToken,chatController.allUsers);
router.route("/get-user/:id").get(verifyToken,chatController.getUser);
router.route("/:id").get(verifyToken,chatController.getMessages);
router.route("/send-message/:id").post(verifyToken,chatController.sendMessage);


module.exports = router;

