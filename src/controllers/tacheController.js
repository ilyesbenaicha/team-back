const asyncHandler = require('express-async-handler')
const Task = require('../model/taskModel')
// @desc get Task
// @route get /api/Task
// @access private
const getTask = asyncHandler(async (req,res)=>{
    const task = await Task.find({user: req.user.id})
    res.sendStatus(200).json(task)
}
)

 
// @desc set task
// @route set /api/task
// @access private
const addTask = asyncHandler(async(req,res)=>{
    if (!req.body.title && !req.body.description ) {
        res.sendStatus(400)
        throw new Error('please add a title')
    }

    const task = await Task.create({
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        technology: req.body.technology,
        developer: req.body.developer,
        user: req.user.id
    })
    res.sendStatus(201).json(task)
})

// @desc update task
// @route update /api/task
// @access private
const updateTask = asyncHandler(async(req,res)=>{
    const task = await Task.findById(req.params.id)

    if (!task){
        res.sendStatus(404)
        throw new Error('task not found')
    }
    const updatedtask = await Task.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
    })
    res.sendStatus(200).json(updatedtask)
}
)
// @desc delete task
// @route delete /api/task
// @access private
const deleteTask = asyncHandler(async(req,res)=>{
    const task = await Task.findById(req.params.id)

    if (!task){
        res.sendStatus(404)
        throw new Error('task not found')
    }
    await Task.remove()
    res.sendStatus(200).json({id: req.params.id})
})

module.exports={
    getTask,
    addTask,
    updateTask,
    deleteTask
}