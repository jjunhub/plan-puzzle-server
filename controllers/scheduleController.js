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
    const response = await scheduleService.createSchedule(userId, scheduleData);
    res.status(201).send(response);
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
    console.log(userId, scheduleId, option);
    const response = await scheduleService.deleteSchedule(userId, scheduleId, option);
    res.status(200).send(response);
}

module.exports = {loadHome, createSchedule, showSchedules, deleteSchedule};