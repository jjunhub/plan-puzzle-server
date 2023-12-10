const db = require('../models/index');
const User = db.User;

exports.toUser = async (userData) => {
    const {id, password, name, nickname, email} = userData;
    return await User.create({
        userId: id,
        userPw: password,
        name: name,
        nickname: nickname,
        email: email
    });
}

exports.fromUser = (user) => {
    const {id, userId, name, nickname, email, imagePath, statusMessage} = user;
    return {
        id: id,
        userId: userId,
        name: name,
        nickname: nickname,
        email: email,
        imagePath: imagePath,
        statusMessage: statusMessage || null
    };
}