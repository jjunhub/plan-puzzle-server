const db = require('../models/index');
const {QueryTypes, Op, INTEGER} = require("sequelize");
const {sequelize} = require("../models/index");

const Recruit = db.Recruit;

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
        UserId: userId,
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
            id: recruitId,
            userId: userId
        }
    });

    if (!destroyNum) {
        //throw new Error()
        //해당하는 userId,recruitId가 없음
    }
}

const updateRecruitState = async(userId, recruitId, state)=> {
    const recruitNum = await Recruit.update({
        state: state
    }, {
        where: {
            id: recruitId,
            UserId: userId
        }
    });
    if(!recruitNum){
        //throw new Error()
        //해당하는 userId,recruitId가 없음
    }
}

module.exports = {createRecruit, getInitialPageData, getPagedRecruits, deleteRecruit, updateRecruitState};
