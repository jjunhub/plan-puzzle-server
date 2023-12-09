const express = require('express');
const router = express.Router();

const users = require('./users');
const schedules = require('./schedules');
const recruits = require('./recruits');
const comments = require('./comments');
const channels = require('./channels');
const checkAuth = require('../middlewares/authHandler');
const wrapAsync = require('../middlewares/wrapAsync');

router.use('/users', users);
router.use('/schedules', wrapAsync(checkAuth), schedules);
router.use('/recruits', wrapAsync(checkAuth), recruits);
router.use('/comments',wrapAsync(checkAuth),comments);
router.use('/channels',wrapAsync(checkAuth),channels);

module.exports = router;