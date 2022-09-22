const mongoose = require('mongoose')

const calanderSchema = mongoose.Schema({
    title:{
        type: String,
        required : [true, 'please add your title']
    },
    
    start:{
        type: Date,
        required:[true, 'please add an start-date'],
       
    },
    end:{
        type: Date,
        required:[true, 'please add an end-date'],
       
    },
})
module.exports = mongoose.model('Calander',calanderSchema)