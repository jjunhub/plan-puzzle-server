const signupService = require('../services/signupService');

const registerUser = async (req, res) => {
    const userData = req.body;
    const response = await signupService.registerUser(userData);

    res.status(201).json(response);
}

const isIdDuplicates = async (req, res) => {
    const userId = req.params.id;
    const response = await signupService.isIdDuplicates(userId);

    res.status(200).json(response);
}
const isNicknameDuplicates = async (req, res) => {
    const nickname = req.params.nickname;
    const response = await signupService.isNicknameDuplicates(nickname);

    res.status(200).json(response);
}

const loginUser = async (req, res) => {
    const userData = req.body;
    const user = await signupService.loginUser(userData);

    req.session.user = {
        id: user.userId,
    }

    res.status(200).json("로그인 성공");
}

module.exports = {registerUser, isIdDuplicates, isNicknameDuplicates, loginUser};