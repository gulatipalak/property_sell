const express = require("express")
const router= express.Router()
const chatController = require("../../controller/chat/chatController")
const verifyToken = require("../../middleware/user/verifyToken")

router.route("/all-users").get(verifyToken,chatController.allUsers);


module.exports = router;

