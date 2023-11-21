const LoginError = {
    MESSAGE: "해당 정보의 유저가 존재하지 않습니다.",
    CODE: 400
};

const NotFoundError = {
    MESSAGE: "해당 페이지를 찾을 수 없습니다.",
    CODE: 404
}

const DuplicateNickNameError = {
    MESSAGE: "이미 존재하는 닉네임입니다.",
    CODE: 400
}

const DuplicateIdError = {
    MESSAGE: "이미 존재하는 아이디입니다.",
    CODE: 400
}

const SignUpError = {
    MESSAGE: "회원가입에 실패하였습니다.",
    CODE: 400
}

module.exports = {LoginError, NotFoundError, DuplicateIdError, DuplicateNickNameError, SignUpError};

