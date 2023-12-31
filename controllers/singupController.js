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
        id: user.id
    }

    res.status(200).json(user);
}
const logoutUser = async (req, res) => {
    req.session.destroy();
    res.status(200).json("로그아웃 성공");
}


module.exports = {registerUser, isIdDuplicates, isNicknameDuplicates, loginUser, logoutUser};
