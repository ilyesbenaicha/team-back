const IssuperAdmin = async(req,res,next) => {
    if(req.user.role==='SuperAdmin')
    return next()
   return res.status(401).json({msg:'no '})

}
export default IssuperAdmin