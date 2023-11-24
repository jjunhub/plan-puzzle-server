// middlewares/errorHandlers.js
const {
    LoginError,
    NotFoundError,
    SignUpError,
    DuplicateNickNameError,
    DuplicateIdError,
    NotAuthorizedError
} = require('../constants/errors');

const errorHandlerMap = {
    [LoginError.MESSAGE]: LoginError,
    [NotFoundError.MESSAGE]: NotFoundError,
    [SignUpError.MESSAGE]: SignUpError,
    [DuplicateNickNameError.MESSAGE]: DuplicateNickNameError,
    [DuplicateIdError.MESSAGE]: DuplicateIdError,
    [NotAuthorizedError.MESSAGE]: NotAuthorizedError
};

const errorHandler = (err, req, res, next) => {
    const error = errorHandlerMap[err.message];

    if (error) {
        res.status(error.CODE).send(error.MESSAGE);
    } else {
        res.status(500).send('서버에 오류가 발생하였습니다.');
    }
};

module.exports = {errorHandler};
