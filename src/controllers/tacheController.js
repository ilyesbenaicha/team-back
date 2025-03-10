const asyncHandler = require('express-async-handler');
const Task = require('../model/taskModel');

// Utility function to handle errors
const handleError = (res, statusCode, message, error) => {
  console.error(message, error);
  res.status(statusCode).json({ message, error: error.message });
};

// @desc Get all tasks
// @route GET /api/task
// @access Private
const getTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find()
      .sort({ date: -1 })
      .populate('project', 'title description')
      .populate('user', 'first_name last_name');
    res.status(200).json(tasks);
  } catch (error) {
    handleError(res, 500, 'Error fetching tasks', error);
  }
});

// @desc Get all completed tasks
// @route GET /api/task/done
// @access Private
const getTasksDone = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find({ etat: 'Done' })
      .sort({ date: -1 })
      .populate('user', 'first_name last_name');
    res.status(200).json(tasks);
  } catch (error) {
    handleError(res, 500, 'Error fetching completed tasks', error);
  }
});

// @desc Get tasks by user ID
// @route GET /api/task/user/:userId
// @access Private
const getTasksByUser = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.userId })
      .sort({ date: -1 })
      .populate('project', 'title description');
    if (!tasks.length) {
      res.status(404).json({ message: 'No tasks found for this user' });
      return;
    }
    res.status(200).json(tasks);
  } catch (error) {
    handleError(res, 500, 'Error fetching tasks by user', error);
  }
});

// @desc Get tasks by project ID
// @route GET /api/task/project/:projectId
// @access Private
const getTasksByProject = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .sort({ date: -1 })
      .populate('user', 'first_name last_name');
    if (!tasks.length) {
      res.status(404).json({ message: 'No tasks found for this project' });
      return;
    }
    res.status(200).json(tasks);
  } catch (error) {
    handleError(res, 500, 'Error fetching tasks by project', error);
  }
});

// @desc Create a new task
// @route POST /api/task
// @access Private
const addTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, start_date, end_date, user, etat, project } = req.body;

    // Validate required fields
    if (!title || !description || !user || !project) {
      res.status(400).json({ message: 'Please provide all required fields: title, description, user, and project' });
      return;
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      start_date,
      end_date,
      user,
      etat,
      project,
    });

    res.status(201).json(task);
  } catch (error) {
    handleError(res, 500, 'Error creating task', error);
  }
});

// @desc Update a task by ID
// @route PUT /api/task/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators run on update
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    handleError(res, 500, 'Error updating task', error);
  }
});

// @desc Update a task by title
// @route PUT /api/task/title/:title
// @access Private
const updateTaskByName = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findOne({ title: req.params.title });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const updatedTask = await Task.findOneAndUpdate({ title: req.params.title }, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators run on update
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    handleError(res, 500, 'Error updating task by title', error);
  }
});

// @desc Delete a task by ID
// @route DELETE /api/task/:id
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await task.remove();
    res.status(200).json({ id: req.params.id, message: 'Task deleted successfully' });
  } catch (error) {
    handleError(res, 500, 'Error deleting task', error);
  }
});

// @desc Get task statistics by status
// @route GET /api/task/status
// @access Private
const getTaskStatistics = asyncHandler(async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$etat', // Group by task status
          total: { $sum: 1 }, // Count tasks in each group
        },
      },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    handleError(res, 500, 'Error fetching task statistics', error);
  }
});

module.exports = {
  getTasks,
  getTasksDone,
  getTasksByUser,
  getTasksByProject,
  addTask,
  updateTask,
  deleteTask,
  updateTaskByName,
  getTaskStatistics,
};