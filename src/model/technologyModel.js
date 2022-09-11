const mongoose = require('mongoose')

const technologySchema = mongoose.Schema({
    title:{
        type: String,
        required : [true, 'please add your title']
    },
    
    description:{
        type: String,
        required:[true, 'please add an description'],
       
    },})
module.exports = mongoose.model('Technology',technologySchema)