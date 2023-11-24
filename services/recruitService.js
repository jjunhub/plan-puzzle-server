const db = require('../models/index');
const {QueryTypes, Op, INTEGER} = require("sequelize");
const {sequelize} = require("../models/index");

const Recruit = db.Recruit;

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

const getRecruits = async (nextId = 999) => {
    const pageSize = 10;
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
    const maxId = nextId - pageSize < 0 ? 0 : nextId - pageSize;
    return {recruits: recruits, maxId: maxId};
}

module.exports = {createRecruit, getRecruits};
