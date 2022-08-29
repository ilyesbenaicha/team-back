const IssuperAdmin = async(req,res,next) => {
<<<<<<< HEAD
        if(req.user.role==='SuperAdmin')
        return next()
       return res.status(401).json({msg:'no '})
  
 }
 module.exports = IssuperAdmin
=======
    if(req.user.role==='SuperAdmin')
    return next()
   return res.status(401).json({msg:'no '})

}
export default IssuperAdmin
>>>>>>> release/v0.0.1
