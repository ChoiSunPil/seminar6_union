var express = require('express');
var router = express.Router();
const user = require('./user/index')
const main = require('./main/index')
router.use('/main',main)
router.use('/user',user)
module.exports = router;
