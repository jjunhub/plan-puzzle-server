const express = require('express');
const recruitController = require('../controllers/recruitController');
const wrapAsync = require("../middlewares/wrapAsync");
const upload = require("../config/multerConfig");

const router = express.Router();

router.post('/', upload.single('image'), wrapAsync(recruitController.createRecruit));
router.get('/', wrapAsync(recruitController.getRecruitData));

router.delete('/:recruitId', wrapAsync(recruitController.deleteRecruit));
router.put('/:recruitId/state', wrapAsync(recruitController.updateRecruitState));
router.post('/:recruitId', wrapAsync(recruitController.participateRecruit));
router.put('/:recruitId', upload.single('image'), wrapAsync(recruitController.updateRecruit));

router.post('/:recruitId/times', wrapAsync(recruitController.getAvailableTime));
router.post('/:recruitId/times/save', wrapAsync(recruitController.saveAvailableTime));
router.get('/:recruitId/times/vote', wrapAsync(recruitController.showVote));
router.post('/:recruitId/times/vote', wrapAsync(recruitController.doVote));
router.put('/:recruitId/times/vote', wrapAsync(recruitController.endVote));

router.get('/search', wrapAsync(recruitController.searchRecruit));

module.exports = router;