const asyncHandler = require('express-async-handler');
const Calendar = require('../models/calendarModel');

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Public
const getCalendarEvents = asyncHandler(async (req, res) => {
    const events = await Calendar.find()
        .populate('createdBy', 'name email')
        .populate('attendees', 'name email');
    res.status(200).json({
        success: true,
        data: events,
    });
});

// @desc    Get single calendar event
// @route   GET /api/calendar/:id
// @access  Public
const getCalendarEvent = asyncHandler(async (req, res) => {
    const event = await Calendar.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('attendees', 'name email');

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    res.status(200).json({
        success: true,
        data: event,
    });
});

// @desc    Add a new calendar event
// @route   POST /api/calendar
// @access  Public
const addCalendarEvent = asyncHandler(async (req, res) => {
    const {
        title,
        start,
        end,
        description,
        location,
        eventType,
        priority,
        color,
        attendees,
        recurring,
        reminders,
        attachments
    } = req.body;

    // Validate required fields
    if (!title || !start || !end) {
        res.status(400);
        throw new Error('Please provide all required fields: title, start, end');
    }

    // Create new event
    const newEvent = await Calendar.create({
        title,
        start,
        end,
        description,
        location,
        eventType,
        priority,
        color,
        createdBy: req.user?._id, // If using authentication
        attendees,
        recurring,
        reminders,
        attachments
    });

    res.status(201).json({
        success: true,
        data: newEvent,
    });
});

// @desc    Update calendar event
// @route   PUT /api/calendar/:id
// @access  Public
const updateCalendarEvent = asyncHandler(async (req, res) => {
    const event = await Calendar.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    const updatedEvent = await Calendar.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('attendees', 'name email');

    res.status(200).json({
        success: true,
        data: updatedEvent,
    });
});

// @desc    Delete calendar event
// @route   DELETE /api/calendar/:id
// @access  Public
const deleteCalendarEvent = asyncHandler(async (req, res) => {
    const event = await Calendar.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    await event.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

module.exports = {
    getCalendarEvents,
    getCalendarEvent,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
};