const asyncHandler = require('express-async-handler');
const Project = require('../model/projectModel');

// @desc Get projects
// @route GET /api/projects
// @access Private
const getproject = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ user: req.user.id })
        .skip(skip)
        .limit(limit);
    res.status(200).json(projects);
});

// @desc Create a project
// @route POST /api/projects
// @access Private
const addproject = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400);
        throw new Error('Please add a title');
    }
    if (!req.body.description) {
        res.status(400);
        throw new Error('Please add a description');
    }

    const project = await Project.create({
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        technology: req.body.technology,
        developer: req.body.developer,
        user: req.user.id,
    });
    res.status(201).json(project);
});

// @desc Update a project
// @route PUT /api/projects/:id
// @access Private
const updateproject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    if (project.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to update this project');
    }

    const updatedproject = await Project.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            technology: req.body.technology,
            developer: req.body.developer,
        },
        { new: true }
    );
    res.status(200).json(updatedproject);
});

// @desc Delete a project
// @route DELETE /api/projects/:id
// @access Private
const deletproject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    if (project.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to delete this project');
    }

    await Project.deleteOne({ _id: req.params.id });
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getproject,
    addproject,
    updateproject,
    deletproject,
};