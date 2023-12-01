const {Op} = require('sequelize');
const moment = require('moment');
require('moment/locale/ko');
const db = require('../models/index');
const Schedule = db.Schedule;
const scheduleDto = require('../dto/scheduleDto')
const {ScheduleNotFoundError, InValidDateError} = require('../constants/errors');

const loadHome = async (userId) => {
    let now = moment();
    const today = now.clone().format('YYYY-MM-DD')

    const schedulesDto = await showSchedules(userId, today);
    const nextSchedules = await Schedule.findAll({
        where: {
            UserId: userId,
            date: today,
            startTime: {
                [Op.gte]: now.format('HH:mm')
            }
        }
    });

    const nextSchedulesDto = nextSchedules.map(schedule => scheduleDto.fromSchedule(schedule));

    return {schedules: schedulesDto, nextSchedules: nextSchedulesDto};

    // subscirbNotices 추가해야함 나중에 모집글 + 채널 완성하면
}

const showSchedules = async (userId, date) => {
    await validateDate(date);
    const momentDate = moment(date, 'YYYY-MM-DD');

    const startDayOfWeek = momentDate.clone().startOf('week').format('YYYY-MM-DD');
    const endDayOfWeek = momentDate.clone().endOf('week').format('YYYY-MM-DD');

    return await findSchedulesByDate(userId, startDayOfWeek, endDayOfWeek);
}

const validateCreateSchedule = async (userId, scheduleData) => {
    const {startDate, endDate, startTime, endTime, repeatPeriod, title} = scheduleData;

    const momentStartDate = moment(startDate, 'YYYY-MM-DD');
    const momentEndDate = moment(endDate, 'YYYY-MM-DD');

    const alreadyExistSchedules = [];
    while (!momentStartDate.isAfter(momentEndDate)) {
        const date = momentStartDate.format('YYYY-MM-DD');
        const findSchedule = await Schedule.findOne({
            where: {
                UserId: userId,
                date: date,
                [Op.or]: [
                    {
                        startTime: {
                            [Op.gte]: startTime,
                            [Op.lt]: endTime
                        }
                    },
                    {
                        endTime: {
                            [Op.gt]: startTime,
                            [Op.lte]: endTime
                        }
                    },
                    {
                        startTime: {
                            [Op.lte]: startTime
                        },
                        endTime: {
                            [Op.gte]: endTime
                        }
                    }
                ]
            }
        });
        if (findSchedule) {
            alreadyExistSchedules.push(findSchedule);
        }
        momentStartDate.add(repeatPeriod, 'days');
    }
    return alreadyExistSchedules.map(schedule => scheduleDto.fromSchedule(schedule));
}


const createSchedule = async (userId, scheduleData) => {
    const {startDate, endDate, startTime, endTime, repeatPeriod, title, content, color} = scheduleData;
    const maxOriginId = await Schedule.getMaxOriginId(userId) + 1;

    await validateDate(startDate, endDate)
    const momentStartDate = moment(startDate, 'YYYY-MM-DD');
    const momentEndDate = moment(endDate, 'YYYY-MM-DD');

    while (!momentStartDate.isAfter(momentEndDate)) {
        const date = momentStartDate.format('YYYY-MM-DD');
        await scheduleDto.toSchedule({
            UserId: userId,
            originId: maxOriginId,
            title: title,
            content: content,
            date: date,
            startTime: startTime,
            endTime: endTime,
            color: color
        });
        momentStartDate.add(repeatPeriod, 'days');
    }
}

const deleteSchedule = async (userId, scheduleId, option) => {
    const schedule = await findScheduleById(userId, scheduleId);
    const {afterDay, total} = option;

    if (total) {
        await deleteAll(userId, schedule);
    } else if (afterDay) {
        await deleteAfterDay(userId, schedule);
    } else {
        await deleteOne(userId, schedule);
    }
}

async function findSchedulesByDate(userId, startDate, endDate) {
    const schedules = await Schedule.findAll({
        where: {
            UserId: userId,
            date: {
                [Op.between]: [startDate, endDate]
            }
        }
    });
    if (schedules === null) {
        throw new Error(ScheduleNotFoundError.MESSAGE);
    }

    return schedules.map(schedule => scheduleDto.fromSchedule(schedule));
}

async function findScheduleById(userId, scheduleId) {
    const schedule = await Schedule.findOne({
        where: {
            UserId: userId,
            id: scheduleId
        }
    });

    if (schedule === null) {
        throw new Error(ScheduleNotFoundError.MESSAGE);
    }

    return scheduleDto.fromSchedule(schedule);
}

async function deleteOne(userId, schedule) {
    const id = schedule.id;

    await Schedule.destroy({
        where: {
            UserId: userId,
            id: id
        }
    });
}

async function deleteAll(userId, schedule) {
    const originId = schedule.originId;

    await Schedule.destroy({
        where: {
            UserId: userId,
            originId: originId
        }
    })
}

async function deleteAfterDay(userId, schedule) {
    const originId = schedule.originId;
    const date = schedule.date;

    await Schedule.destroy({
        where: {
            UserId: userId,
            originId: originId,
            date: {
                [Op.gte]: date
            }
        }
    })
}

async function validateDate(...dates) {
    for (const date of dates) {
        if (!moment(date).isValid()) {
            throw new Error(InValidDateError.MESSAGE);
        }
    }
}

module.exports = {loadHome, createSchedule, showSchedules, deleteSchedule, validateCreateSchedule};