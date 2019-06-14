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
const SelectMainImage = "SELECT img FROM mainImg ORDER BY mainImgIdx DESC LIMIT 1  "
const SelectPopularWebtoons = "SELECT webtoonIdx ,title, writer, thumbNail,views FROM webtoon WHERE IsEnd =1 ORDER BY views DESC   "
const SelectLatestWebtoons = "SELECT webtoonIdx ,title, writer, thumbNail,views FROM webtoon  WHERE IsEnd =1 ORDER BY webtoonIdx DESC "
const SelectEndWebtoons  = "SELECT webtoonIdx ,title, writer, thumbNail,views FROM webtoon where IsEnd = 1"
/*********필요한 쿼리*************/
router.get('/',authUtil.isLoggedin, async(req,res)=>{
    
    let json = {}
    let check = 0
    try{
        const connection = await pool.getConnection(async conn => conn);

        try{
           const [mainImg] = await connection.query(SelectMainImage)
           const [popularWebtoonList] =  await connection.query(SelectPopularWebtoons)
           const [LatestWebtoonList] = await connection.query(SelectLatestWebtoons)
           const [EndWebtoonList] = await connection.query(SelectEndWebtoons) 
           console.log(mainImg)
           console.log(mainImg[0].img)
           console.log(popularWebtoonList)
           json.ActivityImg = mainImg[0].img
           console.l
           json.SelectPopularWebtoonList = popularWebtoonList
           json.LatestWebtoonList = LatestWebtoonList
           json.EndWebtoonList = EndWebtoonList
           res.send(utils.successTrue(statusCode.OK,responseMessage.SEARCH_MAIN_INFO_SUCCESS,json))
           connection.release()
        }
        catch(err)
        {
            console.log(err)
            connection.release()
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))

        }

    }catch(err)
    {
        console.log(err)
        res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
    }

    });





module.exports = router;