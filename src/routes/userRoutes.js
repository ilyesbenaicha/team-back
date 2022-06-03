const express = require("express");
const {
  registerUser,
  loginUser,
  updateUser,
  deletUser,
  getMe,
  getUser
} = require("../controllers/userController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const IssuperAdmin= require ("../middleware/superAdminMiddleware")
router.post("/register",protect, IssuperAdmin, registerUser);
router.post("/login",loginUser);
router.get("/me", protect, getMe);
router.route('/').get(protect,IssuperAdmin,getUser)
router.route('/:id').put(protect,updateUser).delete(protect,IssuperAdmin,deletUser)
module.exports = router;
