// middlewares/authHandler.js
const db = require('../models/index');
const User = db.User;

const checkAuth = async (req, res, next) => {
    const {user} = req.session;
    if (!user) {
        res.status(401).send("로그인이 필요합니다.");
    }

    const findUserId = await User.findOne({
        attributes:['id'],
        where: {'id': user.id}
    });

    if (findUserId === null) {
        res.status(401).send("로그인이 필요합니다.");
    }
    next();
}

module.exports = checkAuth;