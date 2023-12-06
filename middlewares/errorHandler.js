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
    [LoginError.MESSAGE.message]: LoginError,
    [NotFoundError.MESSAGE.message]: NotFoundError,
    [SignUpError.MESSAGE.message]: SignUpError,
    [DuplicateNickNameError.MESSAGE.message]: DuplicateNickNameError,
    [DuplicateIdError.MESSAGE.message]: DuplicateIdError,
    [NotAuthorizedError.MESSAGE.message]: NotAuthorizedError
};

const errorHandler = (err, req, res, next) => {
    const error = errorHandlerMap[err.message];
    console.log(err);

    if (error) {
        res.status(error.CODE).send(error.MESSAGE);
    } else {
        res.status(500).send('서버에 오류가 발생하였습니다.');
    }
};

module.exports = {errorHandler};
