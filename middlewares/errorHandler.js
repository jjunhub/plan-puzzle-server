// middlewares/errorHandlers.js
const { LoginError, NotFoundError } = require('../constants/errors');

const errorHandler = ((err, req, res, next) => {
    if ( err.message === LoginError.MESSAGE ) {
        res.status(LoginError.CODE).send(LoginError.MESSAGE);
        return;
    }

    if (err.message === NotFoundError.MESSAGE) {
        res.status(404).send('요청한 페이지를 찾을 수 없습니다.');
        return;
    }

    res.status(500).send('서버에 오류가 발생하였습니다.');
});

module.exports = { LoginError, errorHandler };
