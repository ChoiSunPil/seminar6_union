var express = require('express');
var router = express.Router();
const path = require('path')

const modulePath  = path.join(__dirname,'../../module')
const pool = require(path.join(__dirname,'../../config/dbPoolConfig.js'))
const responseMessage = require(path.join(modulePath,'./responseMessage.js'))
const utils = require(path.join(modulePath,'./utils.js'))
const statusCode = require(path.join(modulePath,'./statusCode.js'))


/***************성진 part*****************/


// 좋아요 유무
// SELECT count(*) from like where webtoonIdx = ? and useridx=?
//if로 경우의 수 나눠서 0이면 delete, 1이면 insert
// like를 true,false로 나누어서 넣어주기
let data ={
    CheckLike : null
}

router.post('/',async(req,res)=>{
    const LikeQuery = `SELECT * FROM like WHERE webtoonIdx = ${req.body.webtoonIdx} AND userIdx =${req.body.userIdx}`
   // const CheckLike = null;
    try{
        const connection = await pool.getConnection(async conn => conn);
        try{
            const Like = await connection.query(LikeQuery);

            // 해당 webtoonIdx와 userIdx값이 비어있으면 좋아요 저장
            if(!Like){
                const InsertLike = `INSERT INTO like (webtoonIdx, userIdx) VALUES(${req.body.webtoonIdx},${req.body.userIdx})`
                await connection.query(InsertLike);
                data.CheckLike = true
                res.send(utils.successTrue(statusCode.OK,responseMessage.INSERT_LIKE),data)
                // 비어있지 않으면 좋아요 해제
            } else{
                const DeleteLike = `DELETE * FROM like WHERE webtoonIdx = ${req.body.webtoonIdx} AND userIdx =${req.body.userIdx}`
                await connection.query(DeleteLike);
                data.CheckLike = false
                res.send(utils.successTrue(statusCode.OK,responseMessage.DELETE_LIKE),data)
            }
        }catch(err){
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
        }
    }catch(err){
        res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
    }
})






module.exports = router;