const {Op} = require('sequelize');
const moment = require('moment');
require('moment/locale/ko');
const db = require('../models/index');
const Schedule = db.Schedule;

exports.loadHome = async (userId) => {
    try {
        let now = moment();
        const today = now.clone().format('YYYY-MM-DD')
        const schedules = await showSchedules(userId, today);
        const nextSchedules = await Schedule.findAll({
            where: {
                'userId': userId,
                'date': now,
                'startTime': {
                    [Op.gte]: now.format('HH:mm')
                }
            }
        });
        return {schedules: schedules, nextSchedules: nextSchedules};
        // subscirbNotices 추가해야함 나중에 모집글 + 채널 완성하면
    } catch (err) {
        console.log(err);
    }
};

const showSchedules = async (userId, date) => {
    try {
        const momentDate = moment(date, 'YYYY-MM-DD');
        const startDayOfWeek = momentDate.clone().startOf('week').format('YYYY-MM-DD');
        const endDayOfWeek = momentDate.clone().endOf('week').format('YYYY-MM-DD');
        return await findSchedules(userId, startDayOfWeek, endDayOfWeek);
    } catch (err) {
        console.log(err);
    }
}
exports.showSchedules = showSchedules;
const findSchedules = async (userId, startDate, endDate) => {
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