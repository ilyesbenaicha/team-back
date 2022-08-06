const IssuperAdmin = async(req,res,next) => {
        if(req.user.role==='SuperAdmin')
        return next()
       return res.sendStatus(401).json({msg:'no '})
  
 }
 module.exports = IssuperAdmin