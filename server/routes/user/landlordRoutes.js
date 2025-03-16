const express = require("express");
const router = express.Router();
const propertyController = require("../../controller/user/propertyController");
const upload = require("../../middleware/user/multer");
const verifyToken = require("../../middleware/user/verifyToken")

router.route("/add-property").post(verifyToken,upload.single("image"),propertyController.addProperty);
router.route("/get-properties").get(verifyToken,propertyController.getMyProperties);
router.route("/get-property/:id").get(verifyToken,propertyController.getProperty);
router.route("/update-property").patch(verifyToken,upload.single("image"),propertyController.updateProperty);
router.route("/delete-property/:id").delete(verifyToken,propertyController.deleteProperty);


module.exports = router;

