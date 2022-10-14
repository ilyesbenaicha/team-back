const mongoose = require('mongoose')

const tacheSchema = mongoose.Schema({
    title:{
        type: String,
        required : [true, 'please add your title'],
        unique:true
    },
    
    description:{
        type: String,
        required:[true, 'please add an description'],
       
    },
    start_date:{
        type: String,
       required:[true, 'please add a Date']
    },
    end_date:{
        type: String,
        required:[true, 'please add a Date']
    },
    etat:{
        type: String,
        enum:['Do it','In Progress','Awaiting review','Done']
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    project:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    
}, {
    timestamps: true
})
module.exports = mongoose.model('Tache',tacheSchema)