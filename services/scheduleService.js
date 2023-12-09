const {Op} = require('sequelize');

const moment = require('moment');
require('moment/locale/ko');

const db = require('../models/index');
const Schedule = db.Schedule;
const Notice = db.Notice;
const User = db.User;
const Channel = db.Channel;

const scheduleDto = require('../dto/scheduleDto')
const noticeDto = require('../dto/noticeDto');
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

    const user = await User.findByPk(userId);
    const subscribeChannels = await user.getChannels();
    const subscribeChannelIdList = subscribeChannels.map(channel => channel.getId());
    const subscribeNotices = await Notice.findAll({
        where: {
            ChannelId: {
                [Op.in]: subscribeChannelIdList
            }
        },
        include: [{
            model: Channel,
            as: 'Channel',
            attributes: ['id', 'nickname'] // 채널의 닉네임을 가져오기 위해 include 설정
        }],
        order: [['updatedAt', 'DESC']],
        limit: 5
    });

    const nextSchedulesDto = nextSchedules.map(schedule => scheduleDto.fromSchedule(schedule));
    const noticesForRes = subscribeNotices.map(notice => {
        return {
            title: notice.getTitle(),
            content: notice.getContent(),
            channelId: notice.Channel.getId(),
            channelNickname: notice.Channel.getNickname(),
            channelIconImg: notice.Channel.getIconImg() || null
        }
    });
    return {schedules: schedulesDto, nextSchedules: nextSchedulesDto, subscribeNotices: noticesForRes};
}

const showSchedules = async (userId, date) => {
    await validateDate(date);
    const momentDate = moment(date, 'YYYY-MM-DD');

    const startDayOfWeek = momentDate.clone().startOf('week').format('YYYY-MM-DD');
    const endDayOfWeek = momentDate.clone().endOf('week').format('YYYY-MM-DD');

    return await findSchedulesByDate(userId, startDayOfWeek, endDayOfWeek);
}

const validateCreateSchedule = async (userId, scheduleData) => {
    const {startDate, endDate, startTime, endTime, repeatPeriod} = scheduleData;

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

    return {message: '일정이 성공적으로 등록되었습니다.'};
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

    return {message: '일정이 성공적으로 삭제되었습니다.'};
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
        throw new Error(ScheduleNotFoundError.MESSAGE.message);
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
        throw new Error(ScheduleNotFoundError.MESSAGE.message);
    }

    return schedule;
}

async function deleteOne(userId, schedule) {
    const id = schedule.getId();

    await Schedule.destroy({
        where: {
            UserId: userId,
            id: id
        }
    });
}

async function deleteAll(userId, schedule) {
    const originId = schedule.getOriginId();

    await Schedule.destroy({
        where: {
            UserId: userId,
            originId: originId
        }
    })
}

async function deleteAfterDay(userId, schedule) {
    const originId = schedule.getOriginId();
    const date = schedule.getDate();

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
            throw new Error(InValidDateError.MESSAGE.message);
        }
    }
}

module.exports = {loadHome, createSchedule, showSchedules, deleteSchedule, validateCreateSchedule};