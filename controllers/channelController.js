const channelService = require('../services/channelService');

const createChannel = async (req, res) => {
    const userId = req.session.user.id;
    const channelData = req.body;
    const response = await channelService.createChannel(userId, channelData);
    res.status(201).json(response);
}

const getMyChannel = async (req, res) => {
    const userId = req.session.user.id;
    const response = await channelService.getChannelData(userId);
    res.status(200).json(response);
}

const getChannelData = async (req, res) => {
    const channelId = req.params.channelId;
    const response = await channelService.getChannelData(channelId);
    res.status(200).json(response);
}

const updateIconImg = async (req, res) => {
    const imgPath = req.file?.location;
    const userId = req.session.user.id;
    const response = await channelService.updateIconImg(userId, imgPath);
    res.status(200).json(response);
}

const updateThumbnailImg = async (req, res) => {
    const imgPath = req.file?.location;
    const userId = req.session.user.id;
    const response = await channelService.updateThumbnailImg(userId, imgPath);
    res.status(200).json(response);
}

const createNotice = async (req, res) => {
    const noticeData = {...JSON.parse(req.body.data), imgPath: req.file?.location};
    const userId = req.session.user.id;
    const response = await channelService.createNotice(userId, noticeData);
    res.status(201).json(response);
}

const updateSubscribe = async (req, res) => {
    const userId = req.session.user.id;
    const channelId = req.params.channelId;
    const response = await channelService.updateSubscribe(userId, channelId);
    res.status(200).json(response);
}

const getChannelPage = async (req, res) => {
    const minDate = req.query.minDate;

    let response;
    if (!minDate) {
        response = await channelService.getInitialChannelData();
    } else response = await channelService.getPagedChannels(minDate);
    res.status(200).json(response);
}

const deleteMyChannel = async (req, res) => {
    const userId = req.session.user.id;
    const response = await channelService.deleteMyChannel(userId);
    return res.status(200).json(response);
}
module.exports = {
    createChannel,
    getMyChannel,
    getChannelData,
    updateIconImg,
    updateThumbnailImg,
    createNotice,
    updateSubscribe,
    getChannelPage,
    deleteMyChannel
};