const asyncHandler = require('express-async-handler')
const Task = require('../model/taskModel')
// @desc get Task
// @route get /api/Task
// @access private
const getTask = asyncHandler(async (req,res)=>{
    try {
    const task = await Task.find({user: req.user.id}).sort({date: -1})
    res.status(200).json(task)
    }catch(error){
        res.status(500).send("Error: "+error.message);
    }
}
)

 
// @desc set task
// @route set /api/task
// @access private
const addTask = asyncHandler(async(req,res)=>{
    try {
        if (!req.body.title && !req.body.description ) {
            res.status(400)
            throw new Error('please add a title')
        }
    
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            technology: req.body.technology,
            developer: req.body.developer,
            etat : req.body.etat,
            user: req.user.id
        })
        return res.status(201).json(task)
  
    } catch (error) {
        res.status(500).send(error.message);
    }
})
// @desc update task
// @route update /api/task
// @access private
const updateTask = asyncHandler(async(req,res)=>{
    const task = await Task.find({title:req.params.id})

    if (!task){
        res.status(404)
        throw new Error('task not found')
    }
    const updatedtask = await Task.findOneAndUpdate({title:req.params.id}, req.body,{
        new: true,
    })
    res.status(200).json(updatedtask)
}
)
// @desc delete task
// @route delete /api/task
// @access private
const deleteTask = asyncHandler(async(req,res)=>{
    const task = await Task.findById(req.params.id)

    if (!task){
        res.status(404)
        throw new Error('task not found')
    }
    await Task.remove()
    res.status(200).json({id: req.params.id})
})

module.exports={
    getTask,
    addTask,
    updateTask,
    deleteTask
}