const adminMiddleware = async(req,res,next) => { 
    try {
        if(req.user.role==='admin') next()
        return res.status(401).json({msg:'you are not autorized.'})
    } catch (error) {
        return res.status(500).json({msg:'something went wrong !'})
        
    }
 }
 module.exports = adminMiddleware