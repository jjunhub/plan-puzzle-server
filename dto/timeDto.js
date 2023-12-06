const db = require('../models/index');
const Time = db.Time;

exports.toTime = async (recruitId, timeData) => {
    const times = timeData.map(time => ({...time, RecruitId: recruitId}));
    console.log(times);
    Time.bulkCreate(times);
}

exports.fromTime = async (data) => {
    return times = Time.findAll({
        attributes: ['date', 'startTime', 'endTime', 'num'],
        where: {
            RecruitId: data.recruitId
        }
    });
}
