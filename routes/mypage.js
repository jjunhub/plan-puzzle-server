const express = require('express');
const mypageController = require('../controllers/mypageController');
const wrapAsync = require("../middlewares/wrapAsync");
const upload = require("../config/s3Config");

const router = express.Router();

router.put('/', upload.single('image'), wrapAsync(mypageController.updateUserProfile));
router.get('/recruits',wrapAsync(mypageController.getMyRecruits));
router.get('/subscriptions',wrapAsync(mypageController.getMySubscription));
router.get('/participants',wrapAsync(mypageController.getMyParticipants));

router.post('/check',wrapAsync(mypageController.checkUser));
router.post('/password',wrapAsync(mypageController.changePw));

module.exports = router;