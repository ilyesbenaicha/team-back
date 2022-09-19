const asyncHandler = require('express-async-handler')
const Project = require('../model/projectModel')
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({service:'gmail',
auth:{
  user: 'team37240@gmail.com',
  pass: 'iausjhxxwakezztf'
}, port: 465,host : 'smtp.gmail.com'});
// @desc get project
// @route get /api/project
// @access private
const getproject = asyncHandler(async (req,res)=>{
    const project = await Project.find({user: req.user.id}).populate('user')
    res.status(200).json(project)
}
)

 
// @desc set project
// @route set /api/project
// @access private
const addproject = asyncHandler(async(req,res)=>{
    if (!req.body.title && !req.body.description ) {
        res.status(400)
        throw new Error('please add a title')
    }

    const project = await project.create({
        title: req.body.title,
        description: req.body.description,
        Start_date: req.body.Start_date,
        End_date: req.body.End_date,
        user: req.body.user,
    });
    if (project){
        console.log(project)
        transporter.sendMail({
            from : 'team37240@gmail.com',
            to:project.user,
            subject : 'Project description',
            text : `hi ${project.user} this is the description of the project ${project.description}`
        }, function(err,data){
            if (err) {
              console.log('error Occurs',err);
            } else {
              console.log('Eamil sent !!!!')
            }})
    }
    res.status(201).json(project)
})

// @desc update project
// @route update /api/project
// @access private
const updateproject = asyncHandler(async(req,res)=>{
    const project = await project.findById(req.params.id)

    if (!project){
        res.status(404)
        throw new Error('project not found')
    }
    const updatedproject = await project.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
    })
    res.status(200).json(updatedproject)
}
)
// @desc delete project
// @route delete /api/project
// @access private
const deletproject = asyncHandler(async(req,res)=>{
    const project = await project.findById(req.params.id)

    if (!project){
        res.status(404)
        throw new Error('project not found')
    }
    await project.remove()
    res.status(200).json({id: req.params.id})
})

module.exports={
    getproject,
    addproject,
    updateproject,
    deletproject
}