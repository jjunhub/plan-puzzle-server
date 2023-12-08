const recruitService = require('../services/recruitService');
const multer = require('multer');

const createRecruit = async (req, res) => {
    const imagePath = req.file?.location;
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
    const timeSlots = await recruitService.getAvailableTime(recruitId, timeData);
    res.status(200).json(timeSlots);
    //timeSlots이 비었을 때, 즉 가능한 시간이 없을때는 빈 배열 반환
}
const saveAvailableTime = async (req, res) => {
    const recruitId = req.params.recruitId;
    const timeData = req.body;
    await recruitService.saveAvailableTime(recruitId, timeData);
    res.status(200).send();
    //save 안되었을 때 에러처리
}
const showVote = async (req, res) => {
    const recruitId = req.params.recruitId;
    const userId = req.session.user.id;
    const response = await recruitService.showVote(userId, recruitId);
    res.status(200).json(response);
}

const doVote = async (req, res) => {
    const recruitId = req.params.recruitId;
    const userId = req.session.user.id;
    const idList = req.body.idList;
    const response = await recruitService.doVote(userId, recruitId, idList);
    res.status(200).json(response);
}

const endVote = async (req, res) => {
    const recruitId = req.params.recruitId;
    await recruitService.endVote(recruitId);
    res.status(200).send();
}
const searchRecruit = async (req, res) => {
    const queryParameter = req.query;
    let response;

    const nextId = parseInt(queryParameter.minId);
    if (nextId) response = await recruitService.searchPagedRecruits(queryParameter, nextId);
    else response = await recruitService.searchInitialPageData(queryParameter);

    res.status(200).json(response);
}

module.exports = {
    createRecruit,
    getRecruitData,
    deleteRecruit,
    updateRecruitState,
    participateRecruit,
    getAvailableTime,
    saveAvailableTime,
    showVote,
    doVote,
    endVote,
    searchRecruit
};