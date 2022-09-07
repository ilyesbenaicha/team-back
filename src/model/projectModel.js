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
        required:[true, 'please add a duration']
    },
    End_date:{
        type: Date,
        required:[true, 'please add a duration']
    },
    // new shcema
    
    technology:{
        // type:[mongoose.Types.ObjectId]
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