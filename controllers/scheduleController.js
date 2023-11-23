const scheduleService = require('../services/scheduleService');

exports.loadHome = async (req, res) => {
    try {
        const user_id = req.user.id;
        const response = await scheduleService.loadHome(user_id);
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
    }
};

exports.createSchedule = async (req, res) => {
    try {
        const user_id = req.user.id;
        const scheduleData = req.body;
        await scheduleService.createSchedule(user_id, scheduleData);
        res.status(201).send();
    } catch (err) {
        console.log(err);
    }
};

exports.showSchedules = async (req, res) => {
    try {
        const user_id = req.user.id;
        const date = req.query.date;
        const response = await scheduleService.showSchedules(user_id, date);
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
    }
};

exports.deleteSchedule = async (req, res) => {
    try {
        const user_id = req.user.id;
        const scheduleId = req.params.scheduleId;
        const option = req.body;
        await scheduleService.deleteSchedule(user_id, scheduleId, option);
        res.status(200).send();
    } catch (err) {
        console.log(err);
    }
}