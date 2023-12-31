const db = require('../models/index');
const Notice = db.Notice;
const Recruit = db.Recruit;

const toNotice = async (channelId, noticeData) => {
    const {title, content, imgPath} = noticeData;
    const notice = await Notice.create({
        title: title,
        content: content,
        imgPath: imgPath || null,
        ChannelId: channelId
    });
}

const fromNotice = (notice) => {
    const {id, title, content, imgPath, updatedAt} = notice;
    const update = new Date(updatedAt).toLocaleString()
    return {
        id: id,
        title: title,
        content: content,
        imgPath: imgPath || null,
        updatedAt: update
    };
}

module.exports = {toNotice, fromNotice}
