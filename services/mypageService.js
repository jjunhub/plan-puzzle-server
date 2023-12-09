const db = require('../models/index');
const {Op} = require("sequelize");

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


module.exports = {updateUserProfile};
