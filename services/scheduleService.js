const {Op} = require('sequelize');
const moment = require('moment');
require('moment/locale/ko');
const db = require('../models/index');
const Schedule = db.Schedule;

exports.loadHome = async (user_id) => {
    try {
        let now = moment();
        const today = now.clone().format('YYYY-MM-DD')
        const schedules = await showSchedules(user_id, today);
        const nextSchedules = await Schedule.findAll({
            where: {
                'UserId': user_id,
                'date': today,
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

const showSchedules = async (user_id, date) => {
    try {
        const momentDate = moment(date, 'YYYY-MM-DD');
        const startDayOfWeek = momentDate.clone().startOf('week').format('YYYY-MM-DD');
        const endDayOfWeek = momentDate.clone().endOf('week').format('YYYY-MM-DD');
        return await findSchedules(user_id, startDayOfWeek, endDayOfWeek);
    } catch (err) {
        console.log(err);
    }
}
exports.showSchedules = showSchedules;
const findSchedules = async (user_id, startDate, endDate) => {
    try {
        return await Schedule.findAll({
            where: {
                'UserId': user_id,
                'date': {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
};

exports.createSchedule = async (user_id, scheduleData) => {
    try {
        const {startDate, endDate, startTime, endTime, repeatPeriod, title} = scheduleData;
        const momentStartDate = moment(startDate, 'YYYY-MM-DD');
        const momentEndDate = moment(endDate, 'YYYY-MM-DD');
        const maxOriginId = await Schedule.getMaxOriginId(user_id) + 1;
        while (!momentStartDate.isAfter(momentEndDate)) {
            const date = momentStartDate.format('YYYY-MM-DD');
            await Schedule.create({
                UserId: user_id,
                originId: maxOriginId,
                title: title,
                date: date,
                startTime: startTime,
                endTime: endTime
            });
            momentStartDate.add(repeatPeriod, 'days');
        }
    } catch (err) {
        console.log(err);
    }
};

exports.deleteSchedule = async (user_id, scheduleId, option) => {
    try {
        const {afterDay, total} = option;
        if (total) {
            await deleteAll(user_id, scheduleId);
        } else if (afterDay) {
            await deleteAfterDay(user_id, scheduleId);
        } else {
            await deleteOne(user_id, scheduleId);
        }
    } catch (err) {
        console.log(err);
    }
};
const deleteOne = async (user_id, scheduleId) => {
    await Schedule.destroy({
        where: {
            'UserId': user_id,
            'id': scheduleId
        }
    });
};
const deleteAll = async (user_id, scheduleId) => {
    const schedule = await Schedule.findOne({
        where: {
            'UserId': user_id,
            'id': scheduleId
        }
    });
    const originId = schedule.originId;
    await Schedule.destroy({
        where: {
            'UserId': user_id,
            'originId': originId
        }
    })
};

const deleteAfterDay = async (user_id, scheduleId) => {
    const schedule = await Schedule.findOne({
        where: {
            'UserId': user_id,
            'id': scheduleId
        }
    });
    const originId = schedule.originId;
    const date = schedule.date;
    await Schedule.destroy({
        where: {
            'UserId': user_id,
            'originId': originId,
            'date': {
                [Op.gte]: date
            }
        }
    })
};