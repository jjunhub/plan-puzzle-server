const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/scheduleController');

//테스트용
router.use((req, res, next) => {
    req.userId = 'gnocchi';
    next();
});

router.get('/', scheduleController.loadHome);

router.post('/', scheduleController.createSchedule);

router.get('/dates', scheduleController.showSchedules);

module.exports = router;