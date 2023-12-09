const express = require('express');
const channelController = require('../controllers/channelController');
const wrapAsync = require("../middlewares/wrapAsync");

const router = express.Router();

router.post('/', wrapAsync(channelController.createChannel));
router.get('/', wrapAsync(channelController.getMyChannel));

module.exports = router;