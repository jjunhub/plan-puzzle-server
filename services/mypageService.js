const db = require('../models/index');
const {Op} = require("sequelize");
const recruitDto = require('../dto/recruitDto');
const channelDto = require('../dto/channelDto');
const User = db.User;

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

const getMySubscription = async (userId) => {
    const user = await User.findByPk(userId);
    const channels = await user.getChannels();
    return await Promise.all(channels.map(channel => channelDto.iconFromChannel(channel)));
}

const getMyParticipants = async (userId) => {
    const user = await User.findByPk(userId);
    const recruits = await user.getRecruits();
    return await Promise.all(recruits.map(recruit => recruitDto.fromRecruit(recruit)));
}

const checkUser = async (userId, userData) => {
    const {id, password} = userData;
    const user = await User.findByPk(userId);
    if (user.checkUser(id, password)) {
        return {message: 'check user success'};
    }
    //error 유저랑 id,password 안 맞음
}

const changePw = async (userId, userData) => {
    const {newPassword} = userData;
    if (!newPassword) {
        //error
    }
    const user = await User.findByPk(userId);
    user.changePw(newPassword);
    user.save();
    return {message: 'change success'};
}

module.exports = {updateUserProfile, getMyRecruits, getMySubscription, getMyParticipants, checkUser, changePw};
