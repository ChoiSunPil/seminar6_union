var express = require('express');
var router = express.Router();

const upload = require('./upload.js')
const comment = require('./comment.js')
const episode = require('./episode')
const episodeImg = require('./episodeImg')
const comments = require('./comments')
const like = require('./like')


router.use('/episode', episode);
router.use('/episodeImg',episodeImg);
router.use('/comments',comments);
router.use('/like',like);


router.use('/upload', upload);
router.use('/comment', comment);

module.exports = router;
