const express = require('express');
const router = express.Router();

const signUpController = require('../controllers/singupController');

router.post('/', signUpController.registerUser);

router.get('/id/:id', signUpController.isIdDuplicates);

router.get('/nickname/:nickname', signUpController.isNicknameDuplicates);

router.post('/login', signUpController.loginUser);

module.exports = router;