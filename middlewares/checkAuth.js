// middlewares/checkAuth.js

const checkAuth = (req, res, next) => {
    const {user} = req.session;
    console.log(req);
    if (user) {
        next();
    } else {
        res.status(401).send("로그인이 필요합니다.");
    }
}

module.exports = checkAuth;