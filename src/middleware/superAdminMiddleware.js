const IssuperAdmin = async(req,res,next) => { 
    console.log ('***',req.user.role)
        if(req.user.role==='SuperAdmin')
        return next()
       return res.status(401).json({msg:'no '})
  
 }
 module.exports = IssuperAdmin