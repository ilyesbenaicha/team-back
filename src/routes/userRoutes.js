const express = require("express");
const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getMe,
  getUser,
  getAllUsers,
  getAdmins,
  getEmployer,
  resetPassword,
} = require("../controllers/userController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const IssuperAdmin= require ("../middleware/superAdminMiddleware")

router.post("/register",protect, registerUser);
router.post("/login",loginUser);
router.post("/reset",resetPassword);
router.get("/me", protect, getMe);
router.route('/').get(getUser)
router.route('/:id').put(updateUser).delete(protect,IssuperAdmin,deleteUser)
router.get("/getAll",getAllUsers)
router.get("/getAdmin",getAdmins)
router.get("/getEmployer",getEmployer)

module.exports = router;
