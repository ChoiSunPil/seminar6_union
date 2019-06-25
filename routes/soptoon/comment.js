var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const connection = require('../../config/dbConfig');


/***************민경 part*****************/


router.post('/', upload.single('img'), async(req, res) => {
    console.log(111111);
    const insertCommentQuery = 'INSERT INTO comment (episodeIdx, userIdx, contents) VALUES (?, ?, ?)';
    const insertCommentImgQuery = 'INSERT INTO commentImg(commentIdx, img), VALUES(?, ?)';
    const img = req.file.location;

    connection.connect((err) => {
        if (err) {
            console.error('mysql connection error');
            console.error(err);
            throw err;
        }
    })
    connection.query(insertCommentQuery, [req.body.episodeIdx, req.body.userIdx, req.body.contents], (err, result) => {
        console.log(result);
        console.log(222222);
        
        if(err){//comment 테이블에서 에러났을 때
            console.log(err);
            connection.query(insertCommentImgQuery,[req.body.commentIdx, img],(err,result)=>{
                console.log(result);
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.MEMBERSHIP_INSERT_FAIL));
            })
        }else{//comment 테이블에서 에러 안 나면 commentImg테이블에 외래키와 함께 데이터 넣어주어야함
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.MEMBERSHIP_INSERT_SUCCESS));
        }
    });


});

module.exports = router;