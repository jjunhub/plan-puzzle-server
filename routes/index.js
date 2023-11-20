const express = require('express');
const router = express.Router();

const users = require('./users.js');
const schedules = require('./shedules.js');

router.use('/users',users);
router.use('/schedules',schedules);

module.exports = router;