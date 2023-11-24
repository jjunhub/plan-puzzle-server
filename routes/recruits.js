const express = require('express');
const recruitController = require('../controllers/recruitController');
const multer = require("multer");
const path = require('path');

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

router.post('/', upload.single('image'), recruitController.createRecruit);
router.get('/', recruitController.showRecruits);

module.exports = router;