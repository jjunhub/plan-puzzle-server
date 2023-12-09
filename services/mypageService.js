const db = require('../models/index');
const {Op} = require("sequelize");
const recruitDto = require("../dto/recruitDto");

const User = db.User;
const Recruit = db.Recruit;

const updateUserProfile = async (userId, profileData) => {
    const user = await User.findByPk(userId);
    const {imgPath, nickname, statusMessage} = profileData;
    user.updateImgPath(imgPath);
    user.updateNickname(nickname);
    user.updateStatusMessage(statusMessage);
    user.save();
    return {message: 'update profile'};
}

const getMyRecruits = async (userId) => {
    const user = await User.findByPk(userId);
    const recruits = await user.getMyRecruits();
    return await Promise.all(recruits.map(recruit => recruitDto.fromRecruit(recruit)));
}

module.exports = {updateUserProfile,getMyRecruits};
