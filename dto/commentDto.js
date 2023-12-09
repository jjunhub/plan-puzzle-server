const db = require('../models/index');
const Comment = db.Comment;
const User = db.User;

const toComment = async (userId, recruitId, content) => {
    const comment = await Comment.create({
        content: content,
        RecruitId: recruitId,
        UserId: userId
    });
    return await fromComment(comment);
}

const fromComment = async (comment) => {
    const {id, content, UserId, updatedAt} = comment;
    const user = await User.findByPk(UserId);
    const update = new Date(updatedAt).toLocaleString()

    return {
        id: id,
        content: content,
        Writer: user.nickname,
        updatedAt: update
    }
}

module.exports = {toComment, fromComment}
