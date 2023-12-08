const db = require('../models/index');
const Comment = db.Comment;
const User = db.User;

const toComment = async (userId, recruitId, content) => {
    const comment = await Comment.create({
        content: content,
        RecruitId: recruitId,
        UserId: userId
    });

    if (!comment) {
        //error
    }
    return await fromComment(comment);
}

const fromComment = async (comment) => {
    const {content, UserId, updatedAt} = comment;
    const user = await User.findByPk(UserId);
    const update = new Date(updatedAt).toLocaleString()

    return {
        content: content,
        Writer: user.nickname,
        updatedAt: update
    }
}

module.exports = {toComment, fromComment}
