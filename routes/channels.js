const express = require('express');
const channelController = require('../controllers/channelController');
const wrapAsync = require("../middlewares/wrapAsync");
const upload = require("../config/s3Config");

const router = express.Router();

router.post('/', wrapAsync(channelController.createChannel));
router.get('/mychannel', wrapAsync(channelController.getMyChannel));

router.post('/icon', upload.single('image'), wrapAsync(channelController.updateIconImg));
router.post('/thumbnail', upload.single('image'), wrapAsync(channelController.updateThumbnailImg));
router.post('/notices', upload.single('image'), wrapAsync(channelController.createNotice));

router.put('/:channelId', wrapAsync(channelController.updateSubscribe));

router.get('/', wrapAsync(channelController.getChannelPage));

module.exports = router;