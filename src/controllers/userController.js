require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const nodemailer = require("nodemailer")
var generator = require('generate-password');
let transporter = nodemailer.createTransport({service:'gmail',
auth:{
  user: 'team37240@gmail.com',
  pass: 'iausjhxxwakezztf'
}, port: 465,host : 'smtp.gmail.com'});

// @desc register new user
// @route Post /api/user
//@access Public

const registerUser = asyncHandler(async (req, res) => {
  const { email, role,first_name,last_name,tel,addresse,department} = req.body;
  console.log("email", email);
  if (!role || !email) {
   return res.status (400);
    throw new Error("please add all fields");
  }
  //if user exist
  const userExists = await User.findOne({ email });
  if (userExists) {
   return res.status(400);
    throw new Error(" User already exists");
  }
  // hash password
  var password = generator.generate({
    length: 10,
    numbers: true
  });
  console.log(password);
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hash", hashedPassword);
  // Create user
  const user = await User.create({
    email,
     role,
     first_name,
     last_name,
     tel,
     addresse,
     department,
    password: hashedPassword
  });
  if (user) {
      console.log(user)
      transporter.sendMail({
        from : 'team37240@gmail.com',
        to : user.email,
        subject : 'testing and testing',
        text : `hi ${user.email} this is your password ${password}`
      }, function(err,data){
        if (err) {
          console.log('error Occurs',err);
        } else {
          console.log('Eamil sent !!!!')
        }
      })
   return res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } else {
  return  res.status(400);
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
      token: generateToken(user._id, user.email, user.role)
    
    });
    console.log(token);
  } else {
  return  res.status(400);
    throw new Error("INvalid user data ");
  }

  res.json({ message: "Login User" });
});
// @desc register new user  
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

// @desc update user
// @route update /api/user
// @access private
const updateUser = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id)

  if (!user){
      res.status(404)
      throw new Error('user not found')
  }
  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body,{
      new: true,
  })
 return res.status(200).json(updateUser)
}
);

const getAllUsers = asyncHandler(async (req,res)=>{
  const user = await User.find({$or:[{"role": "Admin"},{"role": "Employer"}]})
  res.status(200).json(user)
}
)
const getAdmins = asyncHandler(async (req,res)=>{
  const user = await User.find({ "role": "Admin" } )
  res.status(200).json(user)
}
)

const deletUser = asyncHandler(async(req,res)=>{
  const user = await User.findByIdAndDelete(req.params.id.trim())
 
  if (!user){
     return res.status(404)
      throw new Error('User not found')
  }
  await user.remove()
  res.status(200).json({id: req.params.id})
});
// @desc get project
// @route get /api/project
// @access private
const getUser = asyncHandler(async (req,res)=>{
  const user = await User.find({user: req.user.id})
  return  res.status(200).json(user)
}
)
//generate JWT
const generateToken = ( id, email, role) => {
  return jwt.sign({ id, email , role }, process.env.JWT_SECRET, {
    expiresIn: "10m"
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deletUser,
  getUser,
  generateToken,
  getAllUsers,
  getAdmins
};
