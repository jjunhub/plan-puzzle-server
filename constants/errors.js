const LoginError = {
    MESSAGE: {message: "해당 정보의 유저가 존재하지 않습니다."},
    CODE: 400
};

const NotFoundError = {
    MESSAGE: {message: "해당 페이지를 찾을 수 없습니다."},
    CODE: 404
}

const DuplicateNickNameError = {
    MESSAGE: {message: "이미 존재하는 닉네임입니다."},
    CODE: 400
}

const DuplicateIdError = {
    MESSAGE: {message: "이미 존재하는 아이디입니다."},
    CODE: 400
}

const SignUpError = {
    MESSAGE: {message: "회원가입에 실패하였습니다."},
    CODE: 400
}

const ScheduleNotFoundError = {
    MESSAGE: {message: "ScheduleId에 해당하는 스케줄을 찾을 수 없습니다."},
    CODE: 400
}

const InValidDateError = {
    MESSAGE: {message: "유효하지 않은 날짜입니다."},
    CODE: 400
}

const NotAuthorizedError = {
    MESSAGE: {message: "권한이 없습니다. 로그인이 필요합니다."},
    CODE: 400
}

module.exports = {
    LoginError,
    NotFoundError,
    DuplicateIdError,
    DuplicateNickNameError,
    SignUpError,
    ScheduleNotFoundError,
    InValidDateError,
    NotAuthorizedError
};

