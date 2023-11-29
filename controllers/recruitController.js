const recruitService = require('../services/recruitService');
const multer = require('multer');

const createRecruit = async (req, res) => {
    const imagePath = req.file?.path;
    const recruitData = JSON.parse(req.body.data);
    const userId = req.session.user.id;
    const response = await recruitService.createRecruit(userId, imagePath, recruitData);
    res.status(201).json(response);
}

const getRecruitData = async (req, res) => {
    let response;

    const nextId = parseInt(req.query.minId);

    if (nextId) response = await recruitService.getPagedRecruits(nextId);
    else response = await recruitService.getInitialPageData();

    res.status(200).json(response);
}

const deleteRecruit = async (req, res) => {
    const recruitId = req.params.recruitId;
    const userId = req.session.user.id;
    await recruitService.deleteRecruit(userId, recruitId);
    res.status(200).send('모집글 삭제 완료');
}

const updateRecruitState = async (req, res) => {
    const recruitId = req.params.recruitId;
    const userId = req.session.user.id;
    const state = req.query.state;
    await recruitService.updateRecruitState(userId, recruitId, state);
    res.status(200).send('모집글 상태 변경 완료');
}

const participateRecruit = async (req, res) => {
    const recruitId = req.params.recruitId;
    const userId = req.session.user.id;
    await recruitService.participateRecruit(userId, recruitId);
    res.status(200).send('모집글 참여 완료');
}

const getAvailableTime = async (req, res) => {
    const recruitId = req.params.recruitId;
    const timeData = req.body;
    const response = await recruitService.getAvailableTime(recruitId, timeData);
    res.status(200).json(response);
}

module.exports = {
    createRecruit,
    getRecruitData,
    deleteRecruit,
    updateRecruitState,
    participateRecruit,
    getAvailableTime
};