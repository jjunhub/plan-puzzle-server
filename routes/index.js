const express = require('express');
const router = express.Router();

const users = require('./users');
const schedules = require('./schedules');
const recruits = require('./recruits');
const checkAuth = require('../middlewares/authHandler');
const wrapAsync = require('../middlewares/wrapAsync');

router.use('/users', users);
router.use('/schedules', wrapAsync(checkAuth), schedules);
router.use('/recruits', wrapAsync(checkAuth), recruits);

module.exports = router;