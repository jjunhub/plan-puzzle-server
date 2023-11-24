const recruitService = require('../services/recruitService');
const multer = require('multer');

exports.createRecruit = async (req, res) => {
    const imagePath = req.file?.path;
    const recruitData = JSON.parse(req.body.data);
    const userId = req.session.user.id;
    await recruitService.createRecruit(userId, imagePath, recruitData);
    res.status(201).send();
};