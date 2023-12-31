const db = require('../models/index');
const {Op} = require("sequelize");
const recruitDto = require('../dto/recruitDto');
const channelDto = require('../dto/channelDto');
const userDto = require('../dto/userDto');
const User = db.User;
const {EmptyPasswordError, NotMatchedUserError} = require('../constants/errors')
const {deleteS3Object} = require('../config/s3Config')
const {defaultUserImgPath} = require('../constants/defaultImgPath')

const updateUserProfile = async (userId, profileData) => {
    const user = await User.findByPk(userId);
    const {imgPath, nickname, statusMessage} = profileData;
    const oldImgPath = user.getImgPath();

    if(user.updateImgPath(imgPath)){
        if (oldImgPath !== defaultUserImgPath) {
            deleteS3Object(oldImgPath);
        }
    }
    user.updateNickname(nickname);
    user.updateStatusMessage(statusMessage);
    user.save();

    // if (oldImgPath !== defaultUserImgPath) {
    //     deleteS3Object(oldImgPath);
    // }
    return userDto.fromUser(user);
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
        return {message: '유저 정보 일치'};
    }
    throw new Error(NotMatchedUserError.MESSAGE.message);
}

const changePw = async (userId, userData) => {
    const {newPassword} = userData;
    if (!newPassword) {
        throw new Error(EmptyPasswordError.MESSAGE.message);
    }
    const user = await User.findByPk(userId);
    user.changePw(newPassword);
    user.save();
    return {message: '비밀번호 변경 성공'};
}

module.exports = {updateUserProfile, getMyRecruits, getMySubscription, getMyParticipants, checkUser, changePw};
