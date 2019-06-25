var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const connection = require('../../config/dbConfig');


/***************민경 part*****************/


router.post('/', upload.array('img'), async(req, res) => {
    console.log(11);
    //세 테이블에 대한 쿼리문
    const img = req.files;
    const insertUploadQuery = 'INSERT INTO webtoon (title, writer, thumbNail, views, IsEnd) VALUES (?, ?, ?, ?, ?)';
    const insertEpisodeQuery = 'INSERT INTO episode (title, thumbNail, views, webtoonIdx) VALUES (?, ?, ?, ?)';
    const insertEpisodeImgQuery = 'INSERT INTO episodeImg (img, episodeIdx) VALUES (?,?)';

    //mysql 연결하기
    connection.connect((err) => {
        if (err) {
            console.error('mysql connection error');
            console.error(err);
            throw err;
        }
    });

    connection.query(insertUploadQuery, [req.body.title, req.body.writer, img[0].location, 0, 0], (err, result) => {
        //console.log("1:"+result); //webtoon 테이블에 insert한 결과

        if(err){//webtoon 테이블에서 에러났을 때
            console.log(err);
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.MEMBERSHIP_INSERT_FAIL));
        }else{//webtoon 테이블에서 에러 안 났을 떄
            connection.query(insertEpisodeQuery, [req.body.title, img[0].location, 0, req.body.webtoonIdx], (err, result) => {
                //console.log("2:"+result);
                if(err){//episode 테이블에서 에러났을 때
                console.log(err);
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.MEMBERSHIP_INSERT_FAIL));
                }else{//episode 테이블에서 에러 안 났을 때
                const AI = 'SELECT episodeIdx from episode order by uploadtime DESC limit 1';

                connection.query(AI, (err, result) => {
                    if (err) throw err;
                    //console.log(22); 
                    //console.log("3:"+result); //episode 테이블에 insert한 결과 
                    connection.query(insertEpisodeImgQuery, [img[1].location, result], (err, result) => {
                        //console.log("4:"+result); //episodeImg 테이블에 insert한 결과 
                        
                        if(err){//episodeImg 테이블에서 에러났을 때
                            console.log(err);
                            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.MEMBERSHIP_INSERT_FAIL));
                        }else{//episodeImg 테이블에서 에러 안 났을 때
                            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.MEMBERSHIP_INSERT_SUCCESS));
                        }
                    });
                });
                }
            });
        }
    });
    
    //connection.end();
});

module.exports = router;