const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the event'],
    },
    start: {
        type: Date,
        required: [true, 'Please provide a start date for the event'],
    },
    end: {
        type: Date,
        required: [true, 'Please provide an end date for the event'],
    },
}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Calendar', calendarSchema);