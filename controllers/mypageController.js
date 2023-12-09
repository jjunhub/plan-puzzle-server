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

module.exports = {updateUserProfile, getMyRecruits};