const mypageService = require('../services/mypageService');

const updateUserProfile = async (req, res) => {
    const imgPath = req.file?.location;
    const userId = req.session.user.id;
    const data = JSON.parse(req.body.data);
    const profileData = {imgPath: imgPath, nickname: data.nickname, statusMessage: data.statusMessage};
    const response = await mypageService.updateUserProfile(userId, profileData);
    res.status(200).json(response);
}

const getMyRecruits = async (req, res) => {
    const userId = req.session.user.id;
    const response = await mypageService.getMyRecruits(userId);
    res.status(200).json(response);
}

const getMySubscription = async (req, res) => {
    const userId = req.session.user.id;
    const response = await mypageService.getMySubscription(userId);
    res.status(200).json(response);
}

const getMyParticipants = async (req, res) => {
    const userId = req.session.user.id;
    const response = await mypageService.getMyParticipants(userId);
    res.status(200).json(response);
}

const checkUser = async (req, res) => {
    const userId = req.session.user.id;
    const userData = req.body;
    const response = await mypageService.checkUser(userId, userData);
    res.status(200).json(response);
}

const changePw = async (req, res) => {
    const userId = req.session.user.id;
    const userData = req.body;
    const response = await mypageService.changePw(userId, userData);
    res.status(200).json(response);
}

module.exports = {updateUserProfile, getMyRecruits, getMySubscription, getMyParticipants, checkUser, changePw};