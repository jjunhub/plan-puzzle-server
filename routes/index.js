const express = require('express');
const router = express.Router();

const users = require('./users.js');
const schedules = require('./shedules.js');
const checkAuth = require('../middlewares/authHandler');

router.use('/users',users);
router.use('/schedules', checkAuth ,schedules);

module.exports = router;