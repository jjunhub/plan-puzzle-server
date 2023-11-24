const scheduleService = require('../services/scheduleService');
const {createSchedule} = require("../services/scheduleService");

exports.loadHome = async (req, res) => {
    const userId = req.session.user.id;
    const response = await scheduleService.loadHome(userId);
    res.status(200).json(response);
};

exports.createSchedule = async (req, res) => {
    const userId = req.session.user.id;
    console.log("createSchedule" + userId)
    const scheduleData = req.body;
    await scheduleService.createSchedule(userId, scheduleData);
    res.status(201).send("일정이 성공적으로 추가되었습니다.");
};

exports.showSchedules = async (req, res) => {
    const userId = req.session.user.id;
    const date = req.query.date;
    const response = await scheduleService.showSchedules(userId, date);
    res.status(200).json(response);
};

exports.deleteSchedule = async (req, res) => {
    const userId = req.session.user.id;
    const scheduleId = req.params.scheduleId;
    const option = req.body;
    await scheduleService.deleteSchedule(userId, scheduleId, option);
    res.status(200).send("일정이 성공적으로 삭제되었습니다.");
}