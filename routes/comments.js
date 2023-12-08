const express = require('express');
const commentController = require('../controllers/commentController');
const wrapAsync = require("../middlewares/wrapAsync");

const router = express.Router();

router.post('/:recruitId', wrapAsync(commentController.createComment));
router.get('/:recruitId', wrapAsync(commentController.getComments));
router.put('/:commentId', wrapAsync(commentController.updateComment));
router.delete('/:commentId',wrapAsync(commentController.deleteComment));

module.exports = router;