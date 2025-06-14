const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the event'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    start: {
      type: Date,
      required: [true, 'Please provide a start date for the event'],
      validate: {
        validator: function (value) {
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
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    eventType: {
      type: String,
      enum: ['meeting', 'appointment', 'reminder', 'task', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    color: {
      type: String,
      default: '#3788d8', // Default calendar color
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Color must be a valid hex color code'
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the user who created the event'],
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    recurring: {
      isRecurring: {
        type: Boolean,
        default: false
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: function() {
          return this.recurring.isRecurring;
        }
      },
      endDate: {
        type: Date,
        required: function() {
          return this.recurring.isRecurring;
        },
        validate: {
          validator: function(value) {
            return value > this.start;
          },
          message: 'Recurring end date must be after the start date'
        }
      }
    },
    reminders: [{
      time: {
        type: Number, // minutes before the event
        required: true,
        min: [0, 'Reminder time cannot be negative']
      },
      type: {
        type: String,
        enum: ['email', 'notification', 'both'],
        default: 'notification'
      }
    }],
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for event duration in minutes
calendarSchema.virtual('duration').get(function() {
  if (this.start && this.end) {
    return Math.ceil((this.end - this.start) / (1000 * 60));
  }
  return null;
});

// Indexes for better query performance
calendarSchema.index({ start: 1, end: 1 });
calendarSchema.index({ createdBy: 1, status: 1 });
calendarSchema.index({ 'recurring.isRecurring': 1 });

// Pre-save middleware to ensure end date is after start date
calendarSchema.pre('save', function(next) {
  if (this.isModified('start') || this.isModified('end')) {
    if (this.end <= this.start) {
      next(new Error('End date must be after start date'));
    }
  }
  next();
});

module.exports = mongoose.model('Calendar', calendarSchema);