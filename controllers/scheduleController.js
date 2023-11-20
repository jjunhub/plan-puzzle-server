const scheduleService = require('../services/scheduleService');

exports.loadHome = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const response = await scheduleService.loadHome(userId);
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
    }
};

exports.createSchedule = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const scheduleData = req.body;
        await scheduleService.createSchedule(userId, scheduleData);
        res.status(201).send();
    } catch (err) {
        console.log(err);
    }
};