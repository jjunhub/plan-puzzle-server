const commentService = require('../services/commentService');

const createComment = async (req, res) => {
    const recruitId = req.params.recruitId;
    const userId = req.session.user.id;
    const commentData = req.body;
    const response = await commentService.createComment(userId, recruitId, commentData);
    res.status(201).json(response);
}
const getComments = async (req, res) => {
    const recruitId = req.params.recruitId;
    const response = await commentService.getComments(recruitId);
    res.status(200).json(response);
}

const updateComment = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.session.user.id;
    const commentData = req.body;
    const response = await commentService.updateComment(userId, commentId, commentData);
    res.status(200).json(response);
}

const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.session.user.id;
    const response = await commentService.deleteComment(userId, commentId);
    res.status(200).json(response);
}

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
};