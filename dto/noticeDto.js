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
    if (!notice) {
        //error
    }
}

const fromNotice = (notice) => {
    const {id, title, content, imgPath} = notice;
    return {
        id: id,
        title: title,
        content: content,
        imgPath: imgPath || null
    };
}

module.exports = {toNotice, fromNotice}
