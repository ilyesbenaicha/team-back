const asyncHandler = require('express-async-handler')
const Calander = require('../model/calanderModel')

const getCalander = asyncHandler(async(req,res)=>{
    try{
        const newEvent = await Calander.find()
        res.status(200).json(newEvent)
    }catch(error){
        res.status(500).send("error:  "+error.message)
    }
})
const addCalander = asyncHandler(async(req,res)=>{
try { 
    
    if (!req.body.title && !req.body.start && req.body.end){
        res.status(400)
        throw new Error ('please add all ')
    }
    const newEvent =await Calander.create({
        title : req.body.title,
        start : req.body.start,
        end: req.body.end
    })
    return res.status(201).json(newEvent)
} catch (error) {
    res.status(500).send(error.message);
}
  
})
module.exports={
    getCalander,
    addCalander
}