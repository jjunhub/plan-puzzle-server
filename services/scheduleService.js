const {Op} = require('sequelize');
const moment = require('moment');
require('moment/locale/ko');
const db = require('../models/index');
const Schedule = db.Schedule;
const {ScheduleNotFoundError, InValidDateError} = require('../constants/errors');

const loadHome = async (userId) => {
    let now = moment();
    const today = now.clone().format('YYYY-MM-DD')

    const schedules = await showSchedules(userId, today);
    const nextSchedules = await Schedule.findAll({
        where: {
            'userId': userId,
            'date': today,
            'startTime': {
                [Op.gte]: now.format('HH:mm')
            }
        }
    });

    return {schedules: schedules, nextSchedules: nextSchedules};
    // subscirbNotices 추가해야함 나중에 모집글 + 채널 완성하면
};

const showSchedules = async (userId, date) => {
    await validateDate(date);
    const momentDate = moment(date, 'YYYY-MM-DD');

    const startDayOfWeek = momentDate.clone().startOf('week').format('YYYY-MM-DD');
    const endDayOfWeek = momentDate.clone().endOf('week').format('YYYY-MM-DD');

    return await findSchedules(userId, startDayOfWeek, endDayOfWeek);
}

const createSchedule = async (userId, scheduleData) => {
    const {startDate, endDate, startTime, endTime, repeatPeriod, title} = scheduleData;
    const maxOriginId = await Schedule.getMaxOriginId(userId) + 1;

    await validateDate(startDate, endDate)
    const momentStartDate = moment(startDate, 'YYYY-MM-DD');
    const momentEndDate = moment(endDate, 'YYYY-MM-DD');

    while (!momentStartDate.isAfter(momentEndDate)) {
        const date = momentStartDate.format('YYYY-MM-DD');
        await Schedule.create({
            userId: userId,
            originId: maxOriginId,
            title: title,
            date: date,
            startTime: startTime,
            endTime: endTime
        });
        momentStartDate.add(repeatPeriod, 'days');
    }
};

const deleteSchedule = async (userId, scheduleId, option) => {
    await findSchedule(userId, scheduleId);
    const {afterDay, total} = option;

    if (total) {
        await deleteAll(userId, scheduleId);
    } else if (afterDay) {
        await deleteAfterDay(userId, scheduleId);
    } else {
        await deleteOne(userId, scheduleId);
    }
};

async function findSchedule(userId, scheduleId) {
    const schedule = await Schedule.findOne({
        where: {
            'userId': userId,
            'id': scheduleId
        }
    });

    if (schedule === null) {
        throw new Error(ScheduleNotFoundError.MESSAGE);
    }

    return schedule;
}

async function validateDate(...dates) {
    for (const date of dates) {
        if (!moment(date).isValid()) {
            throw new Error(InValidDateError.MESSAGE);
        }
    }
}


async function findSchedules(userId, startDate, endDate) {
    return await Schedule.findAll({
        where: {
            'userId': userId,
            'date': {
                [Op.between]: [startDate, endDate]
            }
        }
    });
}


async function deleteOne(userId, scheduleId) {
    await findSchedule(userId, scheduleId);

    await Schedule.destroy({
        where: {
            'userId': userId,
            'id': scheduleId
        }
    });
}

async function deleteAll(userId, scheduleId) {
    const schedule = await findSchedule(userId, scheduleId);
    const originId = schedule.originId;

    await Schedule.destroy({
        where: {
            'userId': userId,
            'originId': originId
        }
    })
}

async function deleteAfterDay(userId, scheduleId) {
    const schedule = await findSchedule(userId, scheduleId);
    const originId = schedule.originId;
    const date = schedule.date;

    await Schedule.destroy({
        where: {
            'userId': userId,
            'originId': originId,
            'date': {
                [Op.gte]: date
            }
        }
    })
}

module.exports = {loadHome, createSchedule, showSchedules, deleteSchedule};