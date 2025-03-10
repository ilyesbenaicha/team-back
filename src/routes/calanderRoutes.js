const express = require('express');
const router = express.Router();
const { getCalendarEvents, addCalendarEvent } = require('../controllers/calendarController');

// GET /api/calendar - Get all calendar events
router.get('/', getCalendarEvents);

// POST /api/calendar - Add a new calendar event
router.post('/', addCalendarEvent);

module.exports = router;