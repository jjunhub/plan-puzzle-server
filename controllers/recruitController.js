const recruitService = require('../services/recruitService');
const multer = require('multer');

exports.createRecruit = async (req, res) => {
    const imagePath = req.file?.path;
    const recruitData = JSON.parse(req.body.data);
    const userId = req.session.user.id;
    const response = await recruitService.createRecruit(userId, imagePath, recruitData);
    res.status(201).json(response);
};

exports.showRecruits = async (req, res) => {
    const userId = req.session.user.id;
    const response = await recruitService.showRecruits(userId);
    res.status(200).json(response);
}