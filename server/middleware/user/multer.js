const multer = require("multer");

const storage = multer.memoryStorage(); //store image in memory before uploading

const upload = multer({storage});

module.exports = upload;

