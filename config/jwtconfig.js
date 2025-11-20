

require('dotenv').config()

const jwt = require('jsonwebtoken')
const expiry = '100m'
const secret = process.env.JWT_secret

function generatetoken(userid,role) {
    const token = jwt.sign({userid,role} , secret ,{expiresIn: expiry})
    return token     
}

function tokenvarify(token,callback) {           
       jwt.verify(token,secret,(err,tokendata)=>{
            if(err) {
                    callback(err,null)
            }else {
                 callback(null ,tokendata)
              }
         })
     }

module.exports = {generatetoken,tokenvarify}

