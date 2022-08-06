const asyncHandler = require('express-async-handler')
const Project = require('../model/projectModel')
// @desc get project
// @route get /api/project
// @access private
const getproject = asyncHandler(async (req,res)=>{
    const project = await Project.find({user: req.user.id})
    res.sendStatus(200).json(project)
}
)

 
// @desc set project
// @route set /api/project
// @access private
const addproject = asyncHandler(async(req,res)=>{
    if (!req.body.title && !req.body.description ) {
        res.sendStatus(400)
        throw new Error('please add a title')
    }

    const project = await project.create({
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        technology: req.body.technology,
        developer: req.body.developer,
        user: req.user.id
    })
    res.sendStatus(201).json(project)
})

// @desc update project
// @route update /api/project
// @access private
const updateproject = asyncHandler(async(req,res)=>{
    const project = await project.findById(req.params.id)

    if (!project){
        res.sendStatus(404)
        throw new Error('project not found')
    }
    const updatedproject = await project.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
    })
    res.sendStatus(200).json(updatedproject)
}
)
// @desc delete project
// @route delete /api/project
// @access private
const deletproject = asyncHandler(async(req,res)=>{
    const project = await project.findById(req.params.id)

    if (!project){
        res.sendStatus(404)
        throw new Error('project not found')
    }
    await project.remove()
    res.sendStatus(200).json({id: req.params.id})
})

module.exports={
    getproject,
    addproject,
    updateproject,
    deletproject
}