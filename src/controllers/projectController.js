const asyncHandler = require('express-async-handler');
const Project = require('../model/projectModel');
const nodemailer = require('nodemailer');
const userModel = require('../model/userModel');
require('dotenv').config();

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Store in .env
    pass: process.env.EMAIL_PASS, // Store in .env
  },
  port: 465,
  host: 'smtp.gmail.com',
});

// Utility function to send email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// @desc Get all projects
// @route GET /api/project
// @access Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().populate('user', 'name email'); // Only populate necessary fields
  res.status(200).json(projects);
});

// @desc Get projects by user
// @route GET /api/project/user/:userId
// @access Private
const getProjectsByUser = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.params.userId }).populate('user', 'name email');
  if (!projects.length) {
    res.status(404);
    throw new Error('No projects found for this user');
  }
  res.status(200).json(projects);
});

// @desc Create a project
// @route POST /api/project
// @access Private
const addProject = asyncHandler(async (req, res) => {
  const { title, description, Start_date, End_date, user } = req.body;

  // Validate required fields
  if (!title || !description || !user) {
    res.status(400);
    throw new Error('Please provide all required fields: title, description, and user');
  }

  // Check if user exists
  const emailUser = await userModel.findById(user.trim());
  if (!emailUser) {
    res.status(404);
    throw new Error('User not found');
  }

  // Create project
  const project = await Project.create({
    title,
    description,
    Start_date,
    End_date,
    user,
  });

  // Send email notification
  if (project) {
    const emailText = `Hi ${emailUser.name || emailUser.email}, this is the description of the project: ${project.description}`;
    await sendEmail(emailUser.email, 'New Project Created', emailText);
  }

  res.status(201).json(project);
});

// @desc Update a project
// @route PUT /api/project/:id
// @access Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validators run on update
  });

  res.status(200).json(updatedProject);
});

// @desc Delete a project
// @route DELETE /api/project/:id
// @access Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await project.remove();
  res.status(200).json({ id: req.params.id, message: 'Project deleted successfully' });
});

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getProjectsByUser,
};