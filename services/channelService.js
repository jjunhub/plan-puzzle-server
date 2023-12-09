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

module.exports = {
    createChannel,
    getMyChannel
};
