const db = require('../models/index');
const Schedule = db.Schedule;

exports.toSchedule = async (scheduleData) => {
    const {UserId, originId, title, content, date, startTime, endTime, color} = scheduleData;
    return await Schedule.create({
        UserId: UserId,
        originId: originId,
        title: title,
        content: content,
        date: date,
        startTime: startTime,
        endTime: endTime,
        color: color
    });
}

exports.fromSchedule = (schedule) => {
    const {id, title, content, date, startTime, endTime, color} = schedule;
    return {
        id: id,
        title: title,
        content: content,
        date: date,
        startTime: startTime,
        endTime: endTime,
        color: color
    }
}
