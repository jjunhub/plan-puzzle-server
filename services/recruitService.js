const db = require('../models/index');
const {Op, INTEGER} = require("sequelize");
const moment = require('moment');

const Recruit = db.Recruit;
const User = db.User;
const Schedule = db.Schedule;

//pageSize 상수
const pageSize = 10;
const createRecruit = async (userId, imagePath, recruitData) => {
    const {
        title,
        content,
        owner,
        regionFirst,
        regionSecond,
        peopleNum,
        startDate,
        endDate,
        timeCategory,
        startTime,
        endTime,
        color
    } = recruitData;

    const recruit = await Recruit.create({
        title: title,
        content: content,
        peopleNum: peopleNum,
        regionFirst: regionFirst,
        regionSecond: regionSecond,
        startDate: startDate,
        endDate: endDate || null,
        timeCategory: timeCategory,
        startTime: startTime || null,
        endTime: endTime || null,
        color: color,
        owner: owner,
        WriterId: userId,
        ...(imagePath && {imagePath: imagePath})
    });
    const user = await User.findByPk(userId);
    recruit.addUsers(user);
}

const getInitialPageData = async () => {
    const recruits = await Recruit.findAll({
        order: [['id', 'DESC']],
        limit: pageSize,
        raw: true
    });
    const minId = recruits[recruits.length - 1].id;
    return {recruits: recruits, minId: minId};
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
        raw: true
    });
    const minId = nextId - pageSize < 0 ? 0 : nextId - pageSize;
    return {recruits: recruits, minId: minId};
}

const deleteRecruit = async (userId, recruitId) => {
    const destroyNum = await Recruit.destroy({
        where: {
            'id': recruitId,
            'WriterId': userId
        }
    });

    if (!destroyNum) {
        //throw new Error()
        //해당하는 userId,recruitId가 없음
    }
}

const updateRecruitState = async (userId, recruitId, state) => {
    const recruitNum = await Recruit.update({
        state: state
    }, {
        where: {
            id: recruitId,
            WriterId: userId
        }
    });
    if (!recruitNum) {
        //throw new Error()
        //해당하는 userId,recruitId가 없음
    }
}
const participateRecruit = async (userId, recruitId) => {
    const user = await User.findByPk(userId);
    const recruit = await Recruit.findOne({
        where: {
            id: recruitId,
            WriterId: {
                [Op.ne]: userId
            }
        }
    });
    if (!recruit) {
        return;
        //에러처리
        //작성자가 참여하려고 했거나, recruit이 없음(삭제됨?)
    }
    await recruit.addUsers(user);
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
                                [Op.gte]:currentStartTime,
                                [Op.lt]:currentEndTime
                            }
                        },
                        {
                            endTime: {
                                [Op.gt]:currentStartTime,
                                [Op.lte]:currentEndTime
                            }
                        },
                        //스케줄 > time
                        {
                            startTime: {
                                [Op.lte]:currentStartTime
                            },
                            endTime: {
                                [Op.gte]:currentEndTime
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


module.exports = {
    createRecruit,
    getInitialPageData,
    getPagedRecruits,
    deleteRecruit,
    updateRecruitState,
    participateRecruit,
    getAvailableTime
};
