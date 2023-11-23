const express = require('express');
const router = express.Router();
const wrapAsync = require('../middlewares/wrapAsync');

const signUpController = require('../controllers/singupController');

router.post('/', wrapAsync(signUpController.registerUser));
router.get('/id/:id', wrapAsync(signUpController.isIdDuplicates));
router.get('/nickname/:nickname', wrapAsync(signUpController.isNicknameDuplicates));
router.post('/login', wrapAsync(signUpController.loginUser));

module.exports = router;