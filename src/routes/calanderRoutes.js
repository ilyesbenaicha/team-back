const express = require('express');
const router = express.Router();
const {
    getCalendarEvents,
    getCalendarEvent,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent
} = require('../controllers/calanderController');

// GET /api/calendar - Get all calendar events
router.get('/', getCalendarEvents);

// GET /api/calendar/:id - Get single calendar event
router.get('/:id', getCalendarEvent);

// POST /api/calendar - Add a new calendar event
router.post('/', addCalendarEvent);

// PUT /api/calendar/:id - Update calendar event
router.put('/:id', updateCalendarEvent);

// DELETE /api/calendar/:id - Delete calendar event
router.delete('/:id', deleteCalendarEvent);

module.exports = router;