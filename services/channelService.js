const db = require('../models/index');
// const {Op} = require("sequelize");

const Channel = db.Channel;
const Notice = db.Notice;
const Recruit = db.Recruit;
const User = db.User;

const channelDto = require("../dto/channelDto");
const noticeDto = require('../dto/noticeDto');
const recruitDto = require('../dto/recruitDto');

const pageSize = 10

const createChannel = async (userId, channelData) => {
    await channelDto.toChannel(userId, channelData);
    return {message: 'create channel success'};
}

const getMyChannel = async (userId) => {
    const channel = await Channel.findByPk(userId);
    if (!channel) {
        return {channelState: false};
    }
    let channelsDto = channelDto.fromChannel(channel);

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
    channelsDto = {...channelsDto, recruitNum: recruitsDto.length};

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

const updateSubscribe = async (userId, channelId) => {
    if (userId === channelId) {
        //구독하려는 채널의 주인이 나임->  이런것도 해야하나? 싶긴함
    }

    const channel = await Channel.findByPk(channelId);
    const user = await User.findByPk(userId);
    let response;

    if (await channel.findUserExist(userId)) {
        channel.removeUsers(user);
        channel.decreaseFollowerNum();
        response = {message: '구독 취소'};
    } else {
        channel.addUsers(user);
        channel.increaseFollowerNum();
        response = {message: '구독 성공'};
    }
    channel.save();
    return response;
}

const getInitialChannelData = async () => {
    const channels = await Channel.findAll({
        order: [['recruitUpdatedAt', 'DESC']],
        limit: pageSize
    });
    const minId = channels[channels.length - 1]?.id || 0;
    const channelsDto = channels.map( channel => channelDto.fromChannel(channel));

    return {channels: channelsDto, minId: minId};
}


module.exports = {
    createChannel,
    getMyChannel,
    updateIconImg,
    updateThumbnailImg,
    createNotice,
    updateSubscribe,
    getInitialChannelData
};
