const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    title:{
        type: String,
        required : [true, 'please add your title']
    },
    
    description:{
        type: String,
        required:[true, 'please add an description'],
       
    },
    Start_date:{
        type: Date,
      //  required:[true, 'please add a duration']
    },
    End_date:{
        type: Date,
        //required:[true, 'please add a duration']
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    archive:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: {createdAt: 'created_at'}
})
module.exports = mongoose.model('Project',projectSchema)