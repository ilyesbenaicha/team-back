const asyncHandler = require('express-async-handler');
const Task = require('../model/taskModel');
const logger = require('../utils/logger'); // Import the logger

// @desc Get tasks
// @route GET /api/tasks
// @access Private
const getTask = asyncHandler(async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ date: -1 });
        logger.info('Tasks fetched successfully', { userId: req.user.id, count: tasks.length });
        res.status(200).json(tasks);
    } catch (error) {
        logger.error('Error fetching tasks', { userId: req.user.id, error: error.message });
        res.status(500).send("Error: " + error.message);
    }
});

// @desc Create a task
// @route POST /api/tasks
// @access Private
const addTask = asyncHandler(async (req, res) => {
    try {
        if (!req.body.title) {
            res.status(400);
            throw new Error('Please add a title');
        }
        if (!req.body.description) {
            res.status(400);
            throw new Error('Please add a description');
        }

        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            technology: req.body.technology,
            developer: req.body.developer,
            etat: req.body.etat,
            user: req.user.id,
        });
        logger.info('Task created successfully', { userId: req.user.id, taskId: task._id });
        res.status(201).json(task);
    } catch (error) {
        logger.error('Error creating task', { userId: req.user.id, error: error.message });
        res.status(500).send(error.message);
    }
});

// @desc Update a task
// @route PUT /api/tasks/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        if (task.user.toString() !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to update this task');
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        logger.info('Task updated successfully', { userId: req.user.id, taskId: updatedTask._id });
        res.status(200).json(updatedTask);
    } catch (error) {
        logger.error('Error updating task', { userId: req.user.id, error: error.message });
        res.status(500).send(error.message);
    }
});

// @desc Delete a task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        if (task.user.toString() !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to delete this task');
        }

        await Task.deleteOne({ _id: req.params.id });
        logger.info('Task deleted successfully', { userId: req.user.id, taskId: req.params.id });
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        logger.error('Error deleting task', { userId: req.user.id, error: error.message });
        res.status(500).send(error.message);
    }
});

module.exports = {
    getTask,
    addTask,
    updateTask,
    deleteTask,
};