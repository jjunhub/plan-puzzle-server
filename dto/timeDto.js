const db = require('../models/index');
const Time = db.Time;

exports.toTime = async (recruitId, timeData) => {
    const times = timeData.map(time => ({...time, RecruitId: recruitId}));
    console.log(times);
    Time.bulkCreate(times);
}

exports.fromTime = async (time, userId) => {
    const {id,date, startTime, endTime} = time;
    const vote = await time.getVote(userId);

    return {
        id:id,
        date: date,
        startTime: startTime,
        endTime: endTime,
        num: vote.num,
        voteState: vote.state
    }
}
