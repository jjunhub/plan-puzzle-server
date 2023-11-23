const express = require('express');
const router = express.Router();

const users = require('./users');
const schedules = require('./shedules');
const recruits = require('./recruits');
const checkAuth = require('../middlewares/authHandler');

router.use('/users', users);
router.use('/schedules', checkAuth, schedules);
router.use('/recruits', recruits);

module.exports = router;