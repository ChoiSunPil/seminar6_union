var express = require('express');
var router = express.Router();

const path = require('path')
const modulePath  = path.join(__dirname,'../../module')
const connection = require(path.join(__dirname,'../../config/dbConfig.js'))
const responseMessage = require(path.join(modulePath,'./responseMessage.js'))
const utils = require(path.join(modulePath,'./utils.js'))
const statusCode = require(path.join(modulePath,'./statusCode.js'))


/***************성진 part*****************/


router.get('/:episodeIdx',async(req,res)=>{
    const episodeIdx = req.params.episodeIdx;
    const sql = "SELECT img FROM episodeImg WHERE episodeIdx = ?";

    const episodeImage = await connection.query(sql,episodeIdx);
    console.log(episodeImage[0].webtoonIdx);

    if(!image){
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST),responseMessage.DB_ERR);
    }else if(image==NULL){
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST),responseMessage.EMPTY_IMAGE_LIST);
    }else{
        res.status(200).send(utils.successTrue(statusCode.OK,responseMessage.SEARCH_EPISODE_SUCCESS),episodeImage);
    }
})
module.exports = router;