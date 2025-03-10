const asyncHandler = require('express-async-handler');
const Calendar = require('../models/calendarModel'); // Ensure the model name is correct

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Public
const getCalendarEvents = asyncHandler(async (req, res) => {
    const events = await Calendar.find();
    res.status(200).json({
        success: true,
        data: events,
    });
});

// @desc    Add a new calendar event
// @route   POST /api/calendar
// @access  Public
const addCalendarEvent = asyncHandler(async (req, res) => {
    const { title, start, end } = req.body;

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
    });

    res.status(201).json({
        success: true,
        data: newEvent,
    });
});

module.exports = {
    getCalendarEvents,
    addCalendarEvent,
};