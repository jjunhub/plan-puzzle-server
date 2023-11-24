const recruitService = require('../services/recruitService');
const multer = require('multer');

const createRecruit = async (req, res) => {
    const imagePath = req.file?.path;
    const recruitData = JSON.parse(req.body.data);
    const userId = req.session.user.id;
    const response = await recruitService.createRecruit(userId, imagePath, recruitData);
    res.status(201).json(response);
}

const getRecruits = async (req, res) => {
    const nextId = parseInt(req.query.maxId);
    const response = await recruitService.getRecruits(nextId);
    res.status(200).json(response);
}
module.exports = {createRecruit, getRecruits};