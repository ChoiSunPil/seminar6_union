var express = require('express');
var router = express.Router();
const main = require('./main')

router.use('./',main)


module.exports = router;