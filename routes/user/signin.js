var express = require('express');
var router = express.Router();
const modulePath  = path.join(__dirname,'../../module')
const connection = require(path.join(__dirname,'../../config/dbConfig.js'))
const encryption = require(path.join(modulePath,'./encryption.js'))
const responseMessage = require(path.join(modulePath,'./responseMessage.js'))
const utils = require(path.join(modulePath,'./utils.js'))
const statusCode = require(path.join(modulePath,'./statusCode.js'))
var jwt = require('jsonwebtoken')
const searchIdQuery = "select * from user where id = ?"
router.post('/',(req,res)=>{
    const id = req.body.user_id
    const password  =req.body.user_password
    if(id == undefined || password == undefined)
    {
    //요청 바디값 오류
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    return
    }
    connection.query(selectUserQuery,[id],async(err, result)=>{
        if(err)
        {
          res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
      
        }
        else if(result.length < 1)
        {
          res.send(utils.successFalse(statusCode.NO_CONTENT, responseMessage.ID_OR_PW_WRONG_VALUE))
        }
        else
        {
          await encryption.asyncVerifyConsistency(password,result[0].salt,result[0].password).then(()=>{
      
            let token =jwt.sign({
                data: result[0].userIdx
              }, 'secret', { expiresIn: '1h' });

              let data ={
                  token : token
              }
              res.send(utils.successTrue(statusCode.OK,responseMessage.LOGIN_SUCCESS,data))
          }).catch(()=>{
              res.send(utils.successFalse(statusCode.NO_CONTENT,responseMessage.ID_OR_PW_WRONG_VALUE))
          })
        }
       
      
      
      
      
      })


    
})

module.exports = router;