const express = require('express');
const router = express.Router();
const wrapAsync = require('../middlewares/wrapAsync');
const scheduleController = require('../controllers/scheduleController');

router.get('/', wrapAsync(scheduleController.loadHome));
router.post('/', wrapAsync(scheduleController.createSchedule));
router.get('/dates', wrapAsync(scheduleController.showSchedules));
router.delete('/:scheduleId', wrapAsync(scheduleController.deleteSchedule));

module.exports = router;