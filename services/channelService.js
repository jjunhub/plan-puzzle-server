const db = require('../models/index');
const Channel = db.Channel;
const Notice = db.Notice;
const Recruit = db.Recruit;

const channelDto = require("../dto/channelDto");
const noticeDto = require('../dto/noticeDto');
const recruitDto = require('../dto/recruitDto');

const createChannel = async (userId, channelData) => {
    await channelDto.toChannel(userId, channelData);
    return {message: 'create channel success'};
}

const getMyChannel = async (userId) => {
    const channel = await Channel.findByPk(userId);
    if(!channel){
        return {channelState:false};
    }
    const channelsDto = channelDto.fromChannel(channel);

    const recruits = await Recruit.findAll({
        where: {
            WriterId: userId,
            owner: 'Channel'
        }
    });
    let recruitsDto = [];
    if (recruits) {
        await Promise.all(recruits.map(async recruit => {
            recruitsDto.push(await recruitDto.fromRecruit(recruit));
        }));
    }

    const notices = await Notice.findAll({
        where: {
            ChannelId: userId
        }
    });
    let noticesDto = [];
    if (notices) {
        notices.map(notice => {
            noticesDto.push(noticeDto.fromNotice(notice));
        });
    }

    return {data: channelsDto, recruits: recruitsDto, notices: noticesDto};
}

const updateIconImg = async (userId, imgPath) => {
    const channel = await Channel.findByPk(userId);
    const oldIconImgPath = channel.updateIconImg(imgPath);
    channel.save();
    if (oldIconImgPath !== 'uploads/channels/default.jpg') {
        //원래꺼 삭제하는 로직 추가
    }
    return channel.getIconImg();
}

const updateThumbnailImg = async (userId, imgPath) => {
    const channel = await Channel.findByPk(userId);
    const oldThumbnailImg = channel.updateThumbnailImg(imgPath);
    channel.save();
    if (oldThumbnailImg !== 'uploads/channels/default.jpg') {
        //원래꺼 삭제하는 로직 추가
    }
    return channel.getThumbnailImg();
}

const createNotice = async (userId, noticeData) => {
    await noticeDto.toNotice(userId, noticeData);
    return {message: 'create notice success'};
}

module.exports = {
    createChannel,
    getMyChannel,
    updateIconImg,
    updateThumbnailImg,
    createNotice
};
