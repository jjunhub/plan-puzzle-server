const db = require('../models/index');
const {Op, INTEGER} = require("sequelize");
const moment = require('moment');

const Recruit = db.Recruit;
const User = db.User;
const Schedule = db.Schedule;
const Time = db.Time;
const recruitDto = require('../dto/recruitDto')
const timeDto = require('../dto/timeDto');
const {s3, deleteS3Object} = require('../config/s3Config');
const { defaultRecruitImgPath } = require("../constants/defaultImgPath");
const {
    InvalidRecruitTimeCategoryError,
    NotFoundRecruitError,
    AlreadyExistUserError,
    ExceedDaysError
} = require("../constants/errors");

//pageSize 상수
const pageSize = 10;

const createRecruit = async (userId, imagePath, recruitData) => {
    const {startTime, endTime, timeCategory} = recruitData;

    if (timeCategory === 'TBD' && (startTime || endTime)) {
        throw new Error(InvalidRecruitTimeCategoryError.MESSAGE.message);
    }
    if (timeCategory === 'D' && (!startTime || !endTime)) {
        throw new Error(InvalidRecruitTimeCategoryError.MESSAGE.message);
    }
    await recruitDto.toRecruit({userId, imagePath, ...recruitData});
}

const getInitialPageData = async () => {
    const recruits = await Recruit.findAll({
        order: [['id', 'DESC']],
        limit: pageSize,
    });
    const minId = recruits[recruits.length - 1]?.id || 0;
    const recruitsDto = await Promise.all(recruits.map(async recruit => {
        return await recruitDto.fromRecruit(recruit);
    }));

    return {recruits: recruitsDto, minId: minId};
}

const getPagedRecruits = async (nextId) => {
    const recruits = await Recruit.findAll({
        where: {
            id: {
                [Op.lt]: nextId
            }
        },
        order: [['id', 'DESC']],
        limit: pageSize,
    });
    const minId = nextId - pageSize < 0 ? 0 : nextId - pageSize;
    const recruitsDto = await Promise.all(recruits.map(async recruit => {
        return await recruitDto.fromRecruit(recruit);
    }));

    return {recruits: recruitsDto, minId: minId};
}

const deleteRecruit = async (userId, recruitId) => {
    const recruit = await Recruit.findByPk(recruitId);
    const destroyNum = await Recruit.destroy({
        where: {
            id: recruitId,
            WriterId: userId
        }
    });

    if (!destroyNum) {
        throw new Error(NotFoundRecruitError.MESSAGE.message);
    }

    const imgPath = recruit.getImgPath();
    if (imgPath !== defaultRecruitImgPath) {
        deleteS3Object(imgPath);
    }

    return {message: '모집글 삭제 성공'};
}

const updateRecruitState = async (userId, recruitId, state) => {
    const recruit = await Recruit.findOne({
        where: {
            id: recruitId,
            WriterId: userId
        }
    });
    if (!recruit) {
        throw new Error(NotFoundRecruitError.MESSAGE.message);
    }
    recruit.updateState(state);
    recruit.save();
}

const updateRecruit = async (userId, recruitId, recruitData) => {
    const recruit = await Recruit.findOne({
        where: {
            id: recruitId,
            WriterId: userId
        }
    });
    if (!recruit) {
        throw new Error(NotFoundRecruitError.MESSAGE.message);
    }

    const {timeCategory, startTime, endTime} = recruitData;

    if (timeCategory === 'TBD' && (startTime || endTime)) {
        throw new Error(InvalidRecruitTimeCategoryError.MESSAGE.message);
    }
    if (timeCategory === 'D' && (!startTime || !endTime)) {
        throw new Error(InvalidRecruitTimeCategoryError.MESSAGE.message);
    }

    const oldImgPath = recruit.getImgPath();

    if (oldImgPath !== defaultRecruitImgPath) {
        deleteS3Object(oldImgPath);
    }

    recruit.updateRecruit(recruitData);
    recruit.save();
    return {message: '모집글 수정 성공'};
}

const participateRecruit = async (userId, recruitId) => {
    const user = await User.findByPk(userId);
    const recruit = await Recruit.findOne({
        where: {
            id: recruitId,
            WriterId: {
                [Op.ne]: userId
            }
        },
        include: [{
            model: User,
            as: 'Users',
            through: 'RecruitUser',
            attributes: ['id']
        }]
    });

    if (!recruit) {
        throw new Error(NotFoundRecruitError.MESSAGE.message);
    }

    recruit.Users.map(recruitUser => {
        if (recruitUser.getId() === user.getId()) {
            throw new Error(AlreadyExistUserError.MESSAGE.message);
        }
    });

    await recruit.addUsers(user);

    recruit.increaseParticipateNum();
    recruit.save();
}

const getAvailableTime = async (recruitId, timeData) => {
    const {startDate, endDate, startTime, endTime, interval} = timeData;
    const recruitUsers = await Recruit.findOne({
        where: {
            id: recruitId
        },
        include: [{
            model: User,
            as: 'Users',
            through: 'RecruitUser',
            attributes: ['id']
        }],
    });
    const userIds = recruitUsers.Users.map(user => user.id);

    const momentStartDate = moment(startDate, 'YYYY-MM-DD');
    const momentEndDate = moment(endDate, 'YYYY-MM-DD');

    const timeSlots = [];

    if (momentEndDate.clone().subtract(7, 'days').isAfter(momentStartDate)) {
        throw new Error(ExceedDaysError.MESSAGE.message);
    }

    while (!momentStartDate.isAfter(momentEndDate)) {
        const date = momentStartDate.format('YYYY-MM-DD');
        const momentStartTime = moment(startTime, 'HH:mm');
        const momentEndTime = moment(endTime, 'HH:mm').subtract(interval, 'minutes');

        while (!momentStartTime.isAfter(momentEndTime)) {
            const currentStartTime = momentStartTime.clone().format('HH:mm');
            const currentEndTime = momentStartTime.clone().add(interval, 'minutes').format('HH:mm');

            const findSchedule = await Schedule.findOne({
                where: {
                    UserId: {
                        [Op.in]: userIds
                    },
                    date: date,
                    [Op.or]: [
                        //스케줄 < time
                        {
                            startTime: {
                                [Op.gte]: currentStartTime,
                                [Op.lt]: currentEndTime
                            }
                        },
                        {
                            endTime: {
                                [Op.gt]: currentStartTime,
                                [Op.lte]: currentEndTime
                            }
                        },
                        //스케줄 > time
                        {
                            startTime: {
                                [Op.lte]: currentStartTime
                            },
                            endTime: {
                                [Op.gte]: currentEndTime
                            }
                        }
                    ]
                }
            });
            if (!findSchedule) {
                timeSlots.push({date: date, startTime: currentStartTime, endTime: currentEndTime});
            }
            momentStartTime.add(30, 'minutes');
        }
        momentStartDate.add(1, 'days');
    }
    return timeSlots;
}


const saveAvailableTime = async (recruitId, timeData) => {
    await timeDto.toTime(recruitId, timeData);
    const recruit = await Recruit.findByPk(recruitId);
    recruit.changeVoteStart();
    recruit.save();
}

const showVote = async (userId, recruitId) => {
    const times = await Time.findAll({
        where: {
            RecruitId: recruitId
        }
    });
    return await Promise.all(times.map(async time => {
        return await timeDto.fromTime(time, userId);
    }));
}

const doVote = async (userId, recruitId, idList) => {
    const times = await Time.findAll({
        where: {
            id: {
                [Op.in]: idList
            },
            RecruitId: recruitId
        }
    });
    const user = await User.findByPk(userId);
    times.map(time => {
        time.addUsers(user);
    });
}

const endVote = async (recruitId) => {
    const recruit = await Recruit.findByPk(recruitId);
    if (!recruit) {
        throw new Error(NotFoundRecruitError.MESSAGE.message);
    }
    recruit.changeVoteEnd();
    recruit.save();
}

const searchInitialPageData = async (queryParameter) => {
    const {title, content, writer, sort} = queryParameter;
    let whereConditions = [];

    if (title !== undefined) {
        whereConditions.push({title: {[Op.like]: `%${title}%`}});
    }
    if (content !== undefined) {
        whereConditions.push({content: {[Op.like]: `%${content}%`}});
    }
    if (writer !== undefined) {
        const writerUser = await User.findOne({
            where: {nickname: writer}
        });
        if (writerUser) {
            whereConditions.push({WriterId: writerUser.id});
        }
    }

    let finalWhereCondition = {};
    if (whereConditions.length > 0) {
        finalWhereCondition = {[Op.or]: whereConditions};
    }

    let order = [];
    if (sort === 'oldest') {
        order.push(['createdAt', 'ASC']);
    } else {
        order.push(['createdAt', 'DESC']);
    }

    const recruits = await Recruit.findAll({
        where: finalWhereCondition,
        order: order,
        include: writer !== undefined ? [User] : [],
        limit: pageSize
    });

    let minId;
    if (recruits.length < pageSize) minId = 0;
    else minId = recruits[recruits.length - 1]?.id || 0;

    const recruitsDto = await Promise.all(recruits.map(async recruit => await recruitDto.fromRecruit(recruit)));
    return {recruits: recruitsDto, minId: minId};
}

const searchPagedRecruits = async (queryParameter, nextId) => {
    const {title, content, writer, sort} = queryParameter;
    let whereConditions = [];

    if (title !== undefined) {
        whereConditions.push({title: {[Op.like]: `%${title}%`}});
    }
    if (content !== undefined) {
        whereConditions.push({content: {[Op.like]: `%${content}%`}});
    }
    if (writer !== undefined) {
        const writerUser = await User.findOne({
            where: {nickname: writer}
        });
        if (writerUser) {
            whereConditions.push({WriterId: writerUser.id});
        }
    }

    let finalWhereCondition = {};
    if (whereConditions.length > 0) {
        finalWhereCondition = {[Op.or]: whereConditions};
    }

    let order = [];
    let recruits, minId;
    if (sort === 'oldest') {
        order.push(['createdAt', 'ASC']);
        recruits = await Recruit.findAll({
            where: {
                id: {
                    [Op.gt]: nextId
                },
                ...finalWhereCondition
            },
            order: order,
            include: writer !== undefined ? [User] : [],
            limit: pageSize
        });

        if (recruits.length < pageSize) minId = 0;
        else minId = nextId + recruits.length;

    } else {
        order.push(['createdAt', 'DESC']);
        recruits = await Recruit.findAll({
            where: {
                id: {
                    [Op.lt]: nextId
                },
                ...finalWhereCondition
            },
            order: order,
            include: writer !== undefined ? [User] : [],
            limit: pageSize
        });

        minId = nextId - pageSize < 0 ? 0 : nextId - pageSize;
    }

    const recruitsDto = await Promise.all(recruits.map(recruit => recruitDto.fromRecruit(recruit)));

    return {recruits: recruitsDto, minId: minId};
}

module.exports = {
    createRecruit,
    getInitialPageData,
    getPagedRecruits,
    deleteRecruit,
    updateRecruitState,
    updateRecruit,
    participateRecruit,
    getAvailableTime,
    saveAvailableTime,
    showVote,
    searchInitialPageData,
    searchPagedRecruits,
    doVote,
    endVote
};
