const jwt = require('jsonwebtoken')
const asyncHandler= require('express-async-handler')
const user = require('../model/userModel')
const protect= asyncHandler (async (req,res, next)=>{
    let token 
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //get token from header
            token = req.headers.authorization.split(' ')[1]
            console.log('token',token);
            // verify token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)  
            // get user from the token
            req.user = await user.findById(decoded.id).select('-password') 
           // req.role = decoded.role    
            next(); 
        } catch (error) {
            console.log(error);
            res.sendStatus(401)
            throw new Error('NOt authorized')
        }
    }
    if (!token) {
        res.sendStatus(401)
        throw new Error('NOt authorized , no Token')

    }
})
module.exports={protect}