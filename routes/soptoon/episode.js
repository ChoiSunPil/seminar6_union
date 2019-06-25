var express = require('express');
var router = express.Router();

const path = require('path')
const modulePath  = path.join(__dirname,'../../module')
const pool = require(path.join(__dirname,'../../config/dbPoolConfig.js'))
const responseMessage = require(path.join(modulePath,'./responseMessage.js'))
const utils = require(path.join(modulePath,'./utils.js'))
const statusCode = require(path.join(modulePath,'./statusCode.js'))
const connection = require(path.join(__dirname,'../../config/dbConfig.js'))
const moment = require('moment-timezone');
const upload = require(path.join(__dirname,'../../config/multer.js'))

// 좋아요 유무
// SELECT count(*) from like where webtoonIdx = ? and useridx=?
//if로 경우의 수 나눠서 0이면 delete, 1이면 insert
// like를 true,false로 나누어서 넣어주기


/***************성진 part*****************/

// 해당 웹툰에 대한 에피소드 조회
router.get('/:webtoonIdx', async(req, res) => {

    const webtoonIdx = req.params.webtoonIdx;
    const getEpisode = "SELECT episodeIdx, title, thumbnail ,views, uploadtime FROM episode WHERE webtoonIdx=?"

    if(webtoonIdx == undefined)
    {
    //요청 바디값 오류
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    return
    }

    await connection.query(getEpisode,[webtoonIdx],async(err,Episode)=>{
        if(err){
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
        }else{
            res.send(utils.successTrue(statusCode.OK,responseMessage.SEARCH_EPISODE_INFO_SUCCESS),Episode)
        }
    })

});

//에피소드 타이틀, 썸네일 저장하기
router.post('/:webtoonIdx',upload.fields([{name : 'thumbnail'}]),async(req,res)=>{
    const webtoonIdx = req.params.webtoonIdx;

    const episodeTitle = req.body.title;
    const episodeThumbnail = req.files.thumbnail;

    if(episodeTitle == null || episodeThumbnail == null){
        res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    } else{
        const episodeInsertQuery = "INSERT INTO episode(title,thumbnail,webtoonIdx) VALUE(?,?,?)";

        await connection.query(episodeInsertQuery,[episodeTitle,episodeThumbnail[0].location,webtoonIdx],async(err,Episode)=>{
            if(err){
                res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
            }else{
                res.send(utils.successTrue(statusCode.OK,responseMessage.SEARCH_EPISODE_INFO_SUCCESS),Episode);
            }
        })
    }

})

// 에피소드 이미지 저장하기
router.post('/:episodeIdx',upload.fields([{name : 'img'}]),async(req,res)=>{
    const episodeIdx = req.params.episodeIdx;

    const episodeImg = req.files.img;

    if(episodeImg == null){
        res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    } else{
        const episodeImgInsertQuery = "INSERT INTO episodeImg(img, episodeIdx) VALUE(?,?)";

        await connection.query(episodeImgInsertQuery,[episodeImg[0].location,episodeIdx],async(err,Episode)=>{
            if(err){
                res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
            }else{
                res.send(utils.successTrue(statusCode.OK,responseMessage.SEARCH_EPISODE_INFO_SUCCESS),Episode);
            }
        })
    }

})



module.exports = router;