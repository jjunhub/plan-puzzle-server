const channelService = require('../services/channelService');

const createChannel = async (req, res) => {
    const userId = req.session.user.id;
    const channelData = req.body;
    const response = await channelService.createChannel(userId, channelData);
    res.status(201).json(response);
}

const getMyChannel = async (req, res) => {
    const userId = req.session.user.id;
    const response = await channelService.getMyChannel(userId);
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

module.exports = {
    createChannel,
    getMyChannel,
    updateIconImg,
    updateThumbnailImg
};