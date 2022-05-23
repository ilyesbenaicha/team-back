const mongoose = require('mongoose')

const tacheSchema = mongoose.Schema({
    title:{
        type: String,
        required : [true, 'please add your title']
    },
    
    description:{
        type: String,
        required:[true, 'please add an description'],
       
    },
    start_date:{
        type: Date,
        required:[true, 'please add a Date']
    },
    end_date:{
        type: Date,
        required:[true, 'please add a Date']
    },
    etat:{
        type: String,
        enum:['started','finished','verified']
    },
    employerId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    projectId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Tache',tacheSchema)