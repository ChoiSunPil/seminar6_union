var express = require('express');
var router = express.Router();
const path = require('path')
const modulePath  = path.join(__dirname,'../../module')
const responseMessage = require(path.join(modulePath,'./responseMessage.js'))
const utils = require(path.join(modulePath,'./utils.js'))
const statusCode = require(path.join(modulePath,'./statusCode.js'))
const pool = require(path.join(__dirname,'../../config/dbPoolConfig.js'))
const authUtil = require(path.join(modulePath,'./authUtils'))

/*********필요한 쿼리*************/
const SelectMainImage = "SELECT img FROM mainImg ORDER BY mainImgIdx  DESC LIMIT =1  "
const SelectPopularWebtoons = "SELECT webtoonIdx ,title, writer, thumbNail,views FROM webtoon WHERE IsEnd =1 ORDER BY views DESC   "
const SelectLatestWebtoons = "SELECT webtoonIdx ,title, writer, thumbNail,views FROM webtoon  WHERE IsEnd =1 ORDER BY webtoonIdx DESC "
const SelectEndWebtoons  = "SELECT webtoonIdx ,title, writer, thumbNail,views FROM webtoon where IsEnd = 1"
/*********필요한 쿼리*************/

router.get('./',authUtil.isLoggedin,(req,res)=>{
    
    let json = new Object()
    let check = 0
    pool.getConnection((err, connection) => {
        


        connection.query(SelectMainImage,(err, result) => {
            if (err) {

                check = -1
   
                
            } else {
            
                json.ActivityImg = result[0].img   
            
            }
        });
        
        
        connection.query(SelectPopularWebtoons, (err, result) => {
            if (err) {
                check = -1
            } else {

                
                
                    json.SelectPopularWebtoonList = result   
                
                
    
            }
        });
    
        connection.query(SelectLatestWebtoons , (err, result) => {
            if (err) {
                check = -1
            } else {
            
                json.SelectLatestWebtoonList = result   


            
            }
        });


        connection.query(SelectEndWebtoons , (err, result) => {
            if (err) {
                check = -1
            } else {
                    json.SelectEndWebtoonList = result   
                
                connection.release()
            }
        });


    while(1)
    {
      if(check == -1)
      {
        res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
      }
      else if(check == 4){
        res.send(utils.successFalse(statusCode.OK,responseMessage.SEARCH_MAIN_INFO_SUCCESS,json))
      }

    }

    });



})




module.exports = router;