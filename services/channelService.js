const db = require('../models/index');
const Channel = db.Channel;

const channelDto = require("../dto/channelDto");

const createChannel = async (userId, channelData) => {
    return await channelDto.toChannel(userId, channelData);
}

const getMyChannel = async (userId) => {
    const channel = await Channel.findByPk(userId);
    return channelDto.fromChannel(channel);
}

const updateIconImg = async (userId, imgPath) => {
    const channel = await Channel.findByPk(userId);
    const oldIconImgPath = channel.updateIconImg(imgPath);
    channel.save();
    if(oldIconImgPath !=='uploads/channels/default.jpg'){
        //원래꺼 삭제하는 로직 추가
    }
    return channel.getIconImg();
}

const updateThumbnailImg = async (userId, imgPath) => {
    const channel = await Channel.findByPk(userId);
    const oldThumbnailImg = channel.updateThumbnailImg(imgPath);
    channel.save();
    if(oldThumbnailImg !=='uploads/channels/default.jpg'){
        //원래꺼 삭제하는 로직 추가
    }
    return channel.getThumbnailImg();
}

module.exports = {
    createChannel,
    getMyChannel,
    updateIconImg,
    updateThumbnailImg
};
