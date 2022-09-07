const express = require("express");
const {
  registerUser,
  loginUser,
  updateUser,
  deletUser,
  getMe,
  getUser,
  getAllUsers,
  getAdmins,
  getEmployer
} = require("../controllers/userController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const IssuperAdmin= require ("../middleware/superAdminMiddleware")
router.post("/register",protect, registerUser);
router.post("/login",loginUser);
router.get("/me", protect, getMe);
router.route('/').get(protect,IssuperAdmin,getUser)
router.route('/:id').put(protect,updateUser).delete(protect,IssuperAdmin,deletUser)
router.get("/getAll",getAllUsers)
router.get("/getAdmin",getAdmins)
router.get("/getEmployer",getEmployer)
module.exports = router;
