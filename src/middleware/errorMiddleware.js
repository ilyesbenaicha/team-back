const errorHandler = (err,req,res,next)=>{
    const sendStatusCode= res.sendStatusCode ? res.sendStatusCode : 500
    res.sendStatus(sendStatusCode)
    
    res.json({
        message: err.message,
        stack : process.env.NODE_ENV === 'production' ? null : err.stack
    })
}
module.exports={
    errorHandler,
}