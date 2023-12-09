const channelService = require('../services/channelService');

const createChannel = async (req, res) => {
    const userId = req.session.user.id;
    const channelData = req.body;
    const response = await channelService.createChannel(userId, channelData);
    res.status(201).json(response);
}

const getMyChannel = async(req,res)=>{
    const userId = req.session.user.id;
    const response = await channelService.getMyChannel(userId);
    res.status(200).json(response);
}
module.exports = {
    createChannel,
    getMyChannel
};