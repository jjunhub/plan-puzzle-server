const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.loadHome);
router.post('/', scheduleController.createSchedule);
router.get('/dates', scheduleController.showSchedules);
router.delete('/:scheduleId', scheduleController.deleteSchedule);

module.exports = router;