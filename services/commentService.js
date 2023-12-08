const db = require('../models/index');
const Comment = db.Comment;

const commentDto = require('../dto/commentDto');

const createComment = async (userId, recruitId, commentData) => {
    const content = commentData.content;
    return await commentDto.toComment(userId, recruitId, content);
}

const getComments = async (recruitId) => {
    const comments = await Comment.findAll({
        where: {
            RecruitId: recruitId
        }
    });
    return await Promise.all(comments.map(async (comment) => {
        return await commentDto.fromComment(comment);
    }));
}

const updateComment = async (userId, commentId, commentData) => {
    const {content} = commentData;
    const comment = await Comment.findByPk(commentId);
    comment.updateContent(content);
    await comment.save();
    return await commentDto.fromComment(comment);
}

const deleteComment = async (userId, commentId) => {
    const destroyNum = await Comment.destroy({
        where:{
            id:commentId,
            UserId:userId
        }
    });
    if(!destroyNum){
        //error
    }
}

module.exports = {
    createComment,
    updateComment,
    getComments,
    deleteComment
};
