const express = require("express");
const router = express.Router();
const propertyController = require("../../controller/user/propertyController");
const verifyToken = require("../../middleware/user/verifyToken")

router.route("/add-property").post(verifyToken,propertyController.addProperty);
router.route("/get-properties").get(verifyToken,propertyController.getMyProperties);
router.route("/get-property/:id").get(verifyToken,propertyController.getProperty);
router.route("/update-property").patch(verifyToken,propertyController.updateProperty);
router.route("/delete-property/:id").delete(verifyToken,propertyController.deleteProperty);


module.exports = router;

