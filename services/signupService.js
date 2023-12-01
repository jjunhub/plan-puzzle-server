const db = require('../models/index');
const User = db.User;
const userDto = require('../dto/userDto');
const {LoginError, DuplicateIdError, DuplicateNickNameError, SignUpError} = require('../constants/errors');

const registerUser = async (userData) => {
    const newUser = await userDto.toUser(userData)

    if (newUser === null) {
        throw new Error(SignUpError.MESSAGE);
    }

    return {message: '회원가입이 완료되었습니다.', userId: newUser.userId};
};

const isIdDuplicates = async (id) => {
    const findUserId = await User.findOne({
        where: {userId: id}
    });

    if (findUserId !== null) {
        throw new Error(DuplicateIdError.MESSAGE);
    }

    return {message: '사용 가능한 아이디입니다.'};
}

const isNicknameDuplicates = async (nickname) => {
    const findUserNickname = await User.findOne({
        where: {nickname: nickname}
    });

    if (findUserNickname !== null) {
        throw new Error(DuplicateNickNameError.MESSAGE);
    }

    return {message: '사용 가능한 닉네임입니다.'};
}

const loginUser = async (userData) => {
    const {id, password} = userData;
    const loginUser = await User.findOne({
        where: {
            userId: id,
            userPw: password
        }
    });

    if (loginUser === null) {
        throw new Error(LoginError.MESSAGE);
    }

    return userDto.fromUser(loginUser);
}

module.exports = {registerUser, isIdDuplicates, isNicknameDuplicates, loginUser};