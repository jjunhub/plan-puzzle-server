const db = require('../models/index');
const User = db.User;

exports.registerUser = async (userData) => {
    try {
        const {id, password, name, nickname, email} = userData;
        const newUser = await User.create({
            userId: id,
            userPw: password,
            name: name,
            nickname: nickname,
            email: email
        });
        return {message: '회원가입이 완료되었습니다.', user: newUser};
    } catch (err) {
        console.log(err);
    }
};

exports.isIdDuplicates = async (userId) => {
    try {
        const findUserId = await User.findOne({
            where: {'userId': userId}
        });
        return findUserId !== null ? {message: '이미 존재하는 id입니다.'} : {message: '사용 가능한 id입니다.'};
    } catch (err) {
        console.log(err);
    }
}
exports.isNicknameDuplicates = async (nickname) => {
    try {
        const findUserNickname = await User.findOne({
            where: {'nickname': nickname}
        });
        return findUserNickname !== null ? {message: '이미 존재하는 닉네임입니다.'} : {message: '사용 가능한 닉네임입니다.'};
    } catch (err) {
        console.log(err);
    }
}

exports.loginUser = async (userData) => {
    const {id, password} = userData;
    const loginUser = await User.findOne({
        where: {
            'userId': id,
            'userPw': password
        }
    });
    if (loginUser === null) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    return loginUser;
}