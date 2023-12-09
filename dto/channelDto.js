const db = require('../models/index');
const Channel = db.Channel;
const User = db.User;

const toChannel = async (userId, channelData) => {
    const {title, content} = channelData;
    const channel = await Channel.create({
        id: userId,
        nickname: title,
        content: content,
        recruitUpdatedAt: new Date()
    });
}

const fromChannel = (channel) => {
    const {id, nickname, content, followerNum, iconImgPath, thumbnailImgPath} = channel;
    return {
        id: id,
        title: nickname,
        content: content,
        followerNum: followerNum,
        iconImgPath: iconImgPath,
        thumbnailImgPath: thumbnailImgPath
    };
}

const iconFromChannel = (channel) => {
    const {id, nickname, iconImgPath} = channel;
    return {
        id: id,
        title: nickname,
        iconImgPath: iconImgPath
    };
}

module.exports = {toChannel, fromChannel, iconFromChannel}
