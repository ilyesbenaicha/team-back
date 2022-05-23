const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");

// @desc register new user
// @route Post /api/user
//@access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log("email", email);
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please add all fields");
  }
  //if user exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error(" User already exists");
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hash", hashedPassword);
  // Create user
  const user = await User.create({
    email,
    role,
    name,
    password: hashedPassword
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("INvalid user data ");
  }
  res.json({ message: "register user" });
});
// @desc Authenticate auser
// @route Post /api/user/Login
//@access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("INvalid user data ");
  }

  res.json({ message: "Login User" });
});
// @desc register new user
// @route Get /api/user/me
//@access Public

const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email, role } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    name,
    email,
    role
  });
});
//generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  generateToken
};
