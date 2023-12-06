// middlewares/authHandler.js
const db = require('../models/index');
const User = db.User;
const {NotAuthorizedError} = require('../constants/errors');

const checkAuth = async (req, res, next) => {
    const {user} = req.session;
    if (!user) {
        throw new Error(NotAuthorizedError.MESSAGE.message);
    }

    const findUserId = await User.findOne({
        attributes: ['id'],
        where: {'id': user.id}
    });

    if (findUserId === null) {
        throw new Error(NotAuthorizedError.MESSAGE.message);
    }
    next();
}

module.exports = checkAuth;