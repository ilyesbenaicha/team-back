const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a project title'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long']
    },
    
    description: {
        type: String,
        required: [true, 'Please add a project description'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long']
    },

    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },

    endDate: {
        type: Date,
        required: [true, 'Please add an end date'],
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },

    status: {
        type: String,
        enum: ['active', 'completed', 'on-hold', 'cancelled'],
        default: 'active'
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    category: {
        type: String,
        trim: true
    },

    tags: [{
        type: String,
        trim: true
    }],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project must be associated with a user']
    },

    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    budget: {
        type: Number,
        min: [0, 'Budget cannot be negative']
    },

    progress: {
        type: Number,
        min: [0, 'Progress cannot be less than 0'],
        max: [100, 'Progress cannot be more than 100'],
        default: 0
    },

    archive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Virtual for project duration in days
projectSchema.virtual('duration').get(function() {
    if (this.startDate && this.endDate) {
        return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
    }
    return null;
});

// Index for better query performance
projectSchema.index({ user: 1, status: 1 });
projectSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Project', projectSchema)