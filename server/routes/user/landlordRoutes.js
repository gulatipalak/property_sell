const express = require("express");
const router = express.Router();
const landlordController = require("../../controller/user/landlordController");
const verifyToken = require("../../middleware/user/verifyToken")

router.route("/add-property").post(verifyToken,landlordController.addProperty);
router.route("/get-properties").get(verifyToken,landlordController.getMyProperties)

module.exports = router;

