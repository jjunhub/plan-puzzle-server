const db = require('../models/index');
const Channel = db.Channel;
const User = db.User;

const toChannel = async (userId, channelData) => {
    const {title, content} = channelData;
    const channel = await Channel.create({
        id:userId,
        title: title,
        content: content
    });
    return fromChannel(channel);
}

const fromChannel = (channel) => {
    const {title, content, iconImgPath, thumbnailImgPath} = channel;
    return {
        title: title,
        content: content,
        iconImgPath: iconImgPath,
        thumbnailImgPath: thumbnailImgPath
    };
}

module.exports = {toChannel, fromChannel}
