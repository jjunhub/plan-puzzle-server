const express = require('express');
const mypageController = require('../controllers/mypageController');
const wrapAsync = require("../middlewares/wrapAsync");
const upload = require("../config/s3Config");

const router = express.Router();

router.put('/', upload.single('image'), wrapAsync(mypageController.updateUserProfile));

module.exports = router;