const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the event'],
      trim: true, // Removes unnecessary whitespace
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    start: {
      type: Date,
      required: [true, 'Please provide a start date for the event'],
      validate: {
        validator: function (value) {
          // Ensure the start date is not in the past
          return value >= new Date();
        },
        message: 'Start date must be in the future',
      },
    },
    end: {
      type: Date,
      required: [true, 'Please provide an end date for the event'],
      validate: {
        validator: function (value) {
          // Ensure the end date is after the start date
          return value > this.start;
        },
        message: 'End date must be after the start date',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'Please provide the user who created the event'],
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('Calendar', calendarSchema);