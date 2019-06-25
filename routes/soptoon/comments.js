var express = require('express');
var router = express.Router();
const path = require('path')

const modulePath  = path.join(__dirname,'../../module')
const pool = require(path.join(__dirname,'../../config/dbPoolConfig.js'))
const responseMessage = require(path.join(modulePath,'./responseMessage.js'))
const utils = require(path.join(modulePath,'./utils.js'))
const statusCode = require(path.join(modulePath,'./statusCode.js'))

/***************성진 part*****************/
const CommentList={
    commentIdx : null, // 댓글객체번호
    img : null, // 댓글이미지
    userId : null, // 유저ID
    uploadTime : null, // 업로드시간
    comment : null // 댓글내용
}

router.get('/:episodeIdx',async(req,res)=>{
    console.log(req.params.episodeIdx)
const getComment = `SELECT * FROM comment WHERE episodeIdx = ${req.params.episodeIdx}`;
const getUser = `SELECT id FROM user WHERE userIdx = ${data[0].userIdx}`;
const getCountComment = "SELECT COUNT(commentIdx) FROM comment";
const getCommentImg = `SELECT img FROM commentImg WHERE commentIdx = ${data[0].commentIdx}`;
const getUploadTime = `SELECT uploadtime FROM episode WHERE episodeIdx = ${data[0].episodeIdx}`;

    let json = {}
    
    try{
        const connection = await pool.getConnection(async conn => conn);
        
        try{
            let [data] = await connection.query(getComment);
            console.log(data);
            try{
                const [userId]= await connection.query(getUser);
                CommentList.userId = userId[0].id;

                const [img] = await connection.query(getCommentImg);
                CommentList.img = img[0].img
                console.log(CommentList.img);

                const [uploadTime] = await connection.query(getUploadTime);
                CommentList.uploadTime = uploadTime[0].uploadTime;

                const countComment = await connection.query(getCountComment);
                json.countComment = countComment.length;
                CommentList.comment = data[0].contents;
                CommentList.commentIdx = data[0].commentIdx;

                console.log(CommentList);

                
                json.List = CommentList;
            
                res.send(utils.successTrue(statusCode.OK,responseMessage.SEARCH_COMMENT_INFO_SUCCESS,json))
                connection.release()
            }catch(err){
                res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
            }
        }catch(err){
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
        }
    }catch(err){
        res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
    }
    });

module.exports = router;