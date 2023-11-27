const db = require('../models/index');
const {QueryTypes, Op, INTEGER} = require("sequelize");
const {sequelize} = require("../models/index");

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

    return await Recruit.create({
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
const getAvailableTime = async (recruitId) => {
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

    return await Schedule.findAll({
        attributes: ['startTime', 'endTime'],
        where: {
            UserId: {
                [Op.in]: userIds
            }
        }
    });
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
