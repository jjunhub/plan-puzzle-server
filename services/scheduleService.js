const {Op} = require('sequelize');
const moment = require('moment');
require('moment/locale/ko');
const db = require('../models/index');
const Schedule = db.Schedule;

exports.loadHome = async (userId) => {
    try {
        const now = moment().startOf('day');
        const startDayOfThisWeek = now.clone().startOf('week').format('YYYY-MM-DD');
        const endDayOfThisWeek = now.clone().endOf('week').format('YYYY-MM-DD');
        const schedules = await showSchedules(userId, startDayOfThisWeek, endDayOfThisWeek);
        return schedules;
    } catch (err) {
        console.log(err);
    }
};

const showSchedules = async (userId, startDate, endDate) => {
    try {
        return await Schedule.findAll({
            where: {
                'userId': userId,
                'date': {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
};
exports.showSchedules = showSchedules;

exports.createSchedule = async (userId, scheduleData) => {
    try {
        const {startDate, endDate, startTime, endTime, repeatPeriod, title} = scheduleData;
        const momentStartDate = moment(startDate, 'YYYY-MM-DD');
        const momentEndDate = moment(endDate, 'YYYY-MM-DD');
        while (!momentStartDate.isAfter(momentEndDate)) {
            const date = momentStartDate.format('YYYY-MM-DD');
            await Schedule.create({
                title: title,
                date: date,
                startTime: startTime,
                endTime: endTime,
                userId: userId
            });
            momentStartDate.add(repeatPeriod, 'days');
        }
    } catch (err) {
        console.log(err);
    }
};