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
    duration:{
        type: Date,
        required:[true, 'please add a duration']
    },
    technology:{
        type: String,
        required:[true, 'please add a technology']
    },
    developer:[{
        type: String,
        required: true
    }],
 userId:{
       type : mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
    archive:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Project',projectSchema)