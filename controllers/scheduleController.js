const scheduleService = require('../services/scheduleService');

const loadHome = async (req, res) => {
    const userId = req.session.user.id;
    const response = await scheduleService.loadHome(userId);
    res.status(200).json(response);
};

const createSchedule = async (req, res) => {
    const userId = req.session.user.id;
    const scheduleData = req.body;
    const alreadyExistSchedule = await scheduleService.validateCreateSchedule(userId, scheduleData);
    if (alreadyExistSchedule.length !== 0) {
        res.status(200).json(alreadyExistSchedule);
        return;
    }
    await scheduleService.createSchedule(userId, scheduleData);
    res.status(201).send("일정이 성공적으로 추가되었습니다.");
};

const showSchedules = async (req, res) => {
    const userId = req.session.user.id;
    const date = req.query.date;
    const response = await scheduleService.showSchedules(userId, date);
    res.status(200).json(response);
};

const deleteSchedule = async (req, res) => {
    const userId = req.session.user.id;
    const scheduleId = req.params.scheduleId;
    const option = req.body;
    await scheduleService.deleteSchedule(userId, scheduleId, option);
    res.status(200).send("일정이 성공적으로 삭제되었습니다.");
}

module.exports = {loadHome, createSchedule, showSchedules, deleteSchedule};