// middlewares/errorHandlers.js

const CustomErrors = {
    NOT_FOUND: 'NOT_FOUND',
    INVALID_INPUT: 'INVALID_INPUT',
};

function errorHandler(err, req, res, next) {
    if (err.message === CustomErrors.NOT_FOUND) {
        res.status(404).send('요청한 페이지를 찾을 수 없습니다.');
    } else if (err.message === CustomErrors.INVALID_INPUT) {
        res.status(400).send('유효하지 않은 입력입니다.');
    } else {
        res.status(500).send('서버에서 오류가 발생했습니다.');
    }
}

module.exports = { CustomErrors, errorHandler };
