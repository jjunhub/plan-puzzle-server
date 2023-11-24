const db = require('../models/index');
const Recruit = db.Recruit;
const User = db.User;

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

    return newRecruit = await Recruit.create({
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

const showRecruits = async userId => {
    return await Recruit.findAll({
        where: {
            'UserId': userId
        }
    });
}

module.exports = {createRecruit, showRecruits};
