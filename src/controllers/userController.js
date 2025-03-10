require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');
const nodemailer = require('nodemailer');
const generator = require('generate-password');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables
    pass: process.env.EMAIL_PASS,
  },
  port: 465,
  host: 'smtp.gmail.com',
});

const registerUser = asyncHandler(async (req, res) => {
  const { email, role, first_name, last_name, tel, addresse, department } = req.body;

  // Validate required fields
  if (!email || !role) {
    return res.status(400).json({ message: 'Please provide email and role' });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Generate a random password
  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    email,
    role,
    first_name,
    last_name,
    tel,
    addresse,
    department,
    password: hashedPassword,
  });

  if (user) {
    // Send email with the generated password
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to Our Company',
      html: `
        <h3>Dear ${user.first_name},</h3>
        <p>Welcome to our company! We're so excited to have you as part of our team.</p>
        <p>Your temporary password is: <strong>${password}</strong></p>
        <p>Please reset your password using this link: <a href="http://localhost:3000/reset">Reset Password</a></p>
        <p>Regards,</p>
        <p>Online Service</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent successfully');
      }
    });

    return res.status(201).json({
      _id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      tel: user.tel,
      addresse: user.addresse,
      department: user.department,
    });
  } else {
    return res.status(400).json({ message: 'Invalid user data' });
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Validate password
  if (user && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      token: generateToken(user._id, user.email, user.role, user.first_name),
    });
  } else {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update user password
  user.password = hashedPassword;
  await user.save();

  return res.status(200).json({ message: 'Password updated successfully' });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  return res.status(200).json(updatedUser);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id.trim());
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json({ message: 'User deleted successfully' });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ $or: [{ role: 'Admin' }, { role: 'Employer' }] });
  return res.status(200).json(users);
});

const generateToken = (id, email, role, first_name) => {
  return jwt.sign({ id, email, role, first_name }, process.env.JWT_SECRET, {
    expiresIn: '10m',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser,
  getAllUsers,
  resetPassword,
};