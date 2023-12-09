// middlewares/errorHandlers.js
const {
    LoginError,
    NotFoundError,
    DuplicateIdError,
    DuplicateNickNameError,
    SignUpError,
    ScheduleNotFoundError,
    InValidDateError,
    NotAuthorizedError,
    InvalidRecruitTimeCategoryError,
    InvalidRecruitError,
    NotFoundRecruitError,
    AlreadyExistUserError,
    ExceedDaysError,
    NotMatchedUserError,
    EmptyPasswordError
} = require('../constants/errors');
const {ValidationError} = require("sequelize");
const {MulterError} = require("multer");

const errorHandlerMap = {
    [LoginError.MESSAGE.message]: LoginError,
    [NotFoundError.MESSAGE.message]: NotFoundError,
    [SignUpError.MESSAGE.message]: SignUpError,
    [DuplicateNickNameError.MESSAGE.message]: DuplicateNickNameError,
    [DuplicateIdError.MESSAGE.message]: DuplicateIdError,
    [NotAuthorizedError.MESSAGE.message]: NotAuthorizedError,
    [InValidDateError.MESSAGE.message]: InValidDateError,
    [ScheduleNotFoundError.MESSAGE.message]: ScheduleNotFoundError,
    [InvalidRecruitTimeCategoryError.MESSAGE.message]: InvalidRecruitTimeCategoryError,
    [InvalidRecruitError.MESSAGE.message]: InvalidRecruitError,
    [NotFoundRecruitError.MESSAGE.message]: NotFoundRecruitError,
    [AlreadyExistUserError.MESSAGE.message]: AlreadyExistUserError,
    [ExceedDaysError.MESSAGE.message]: ExceedDaysError,
    [NotMatchedUserError.MESSAGE.message]: NotMatchedUserError,
    [EmptyPasswordError.MESSAGE.message]: EmptyPasswordError
};

const errorHandler = (err, req, res, next) => {
    const error = errorHandlerMap[err.message];
    console.log(err);

    if (error) {
        res.status(error.CODE).send(error.MESSAGE);
    } else if (err instanceof ValidationError) {
        res.status(400).send({"Sequelize error": err.message});
    } else if (err instanceof MulterError) {
        res.status(400).send({"Multer error": err.message});
    } else {
        res.status(500).send('서버에 오류가 발생하였습니다.');
    }
};

module.exports = {errorHandler};
