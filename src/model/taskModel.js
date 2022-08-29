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
      // required:[true, 'please add a Date']
    },
    end_date:{
        type: Date,
      //  required:[true, 'please add a Date']
    },
    etat:{
        type: String,
<<<<<<< HEAD
        enum:['Do it','In Progress','Awaiting review','Done']
=======
        enum:['Do_it','In_Progress','Awaiting_review','Done']
>>>>>>> release/v0.0.1
    },
    employerId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    projectId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    
}, {
    timestamps: true
})
module.exports = mongoose.model('Tache',tacheSchema)