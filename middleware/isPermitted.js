const jwt = require('jsonwebtoken')
const Role = require('../models/role')
require('dotenv').config()

module.exports = async (req,res,next)=>{
    let token = req.headers['x-access-token']
    jwt.verify(token,process.env.JWT_SECRET,async (err,decode)=>{
        if(decode){
            let url = req.url
            const previlege = url.split('/')
            const previleges = await Role.findOne({name : decode.role})
             if(previleges.previleges.indexOf(previlege[1]) > -1){
                next()
             }else{
                 return res.status(400).json({
                     message : 'User is not permitted',status : 400,data : {}
                 })
             }
        }
    })
}