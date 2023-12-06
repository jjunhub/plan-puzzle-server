const express = require('express');
const recruitController = require('../controllers/recruitController');
const multer = require("multer");
const path = require('path');
const wrapAsync = require("../middlewares/wrapAsync");

const router = express.Router();

const upload = multer({
    storage : multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/recruits');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            const base = path.basename(file.originalname, ext);
            cb(null, base + '-' + uniqueSuffix + ext)
        }
    })
});

router.post('/', upload.single('image'), wrapAsync(recruitController.createRecruit));
router.get('/', wrapAsync(recruitController.getRecruitData));

router.delete('/:recruitId', wrapAsync(recruitController.deleteRecruit));
router.put('/:recruitId', wrapAsync(recruitController.updateRecruitState));
router.post('/:recruitId', wrapAsync( recruitController.participateRecruit));

router.post('/:recruitId/times',wrapAsync(recruitController.getAvailableTime));
router.post('/:recruitId/times/save',wrapAsync(recruitController.saveAvailableTime));

router.post('/:recruitId/times',wrapAsync( recruitController.getAvailableTime));
router.get('/search', wrapAsync(recruitController.searchRecruit));

module.exports = router;