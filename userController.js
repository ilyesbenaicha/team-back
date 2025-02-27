require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const nodemailer = require("nodemailer");
const { welcomeEmail } = require('../utils/emailTemplates'); // Import the email template

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'team37240@gmail.com',
    pass: 'iausjhxxwakezztf'
  },
  port: 465,
  host: 'smtp.gmail.com'
});


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    email,
    role,
    name,
    password: hashedPassword,
  });

  if (user) {
    // Send email
    const mailOptions = {
      from: 'team37240@gmail.com',
      to: user.email,
      subject: 'Welcome to Our Platform!',
      html: welcomeEmail(user.name, user.email, user.role), // Use the email template
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log('Error occurred:', err);
      } else {
        console.log('Email sent!');
      }
    });

    return res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    return res.status(400).json({ message: "Invalid user data" });
  }
});


// @desc Authenticate user
// @route POST /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id, user.email, user.role);
    console.log(token); // Log the token
    return res.status(200).json({ token });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
});

// @desc Get user data
// @route GET /api/user/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// @desc Update user
// @route PUT /api/user/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Ensure the logged-in user is authorized to update
  if (user._id.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to update this user" });
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  return res.status(200).json(updatedUser);
});

// @desc Delete user
// @route DELETE /api/user/:id
// @access Private
const deletUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Ensure the logged-in user is authorized to delete
  if (user._id.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to delete this user" });
  }

  await User.deleteOne({ _id: req.params.id });
  return res.status(200).json({ id: req.params.id });
});

// @desc Get all users
// @route GET /api/user
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// @desc Get all admins
// @route GET /api/user/admins
// @access Private
const getAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: "Admin" });
  res.status(200).json(admins);
});

// Generate JWT
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deletUser,
  getAllUsers,
  getAdmins,
  generateToken,
};