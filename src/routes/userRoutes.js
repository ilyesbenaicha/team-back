const express = require("express");
const {
  registerUser,
  loginUser,
  getMe
} = require("../controllers/userController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const IssuperAdmin= require ("../middleware/superAdminMiddleware")
router.post("/register",protect, IssuperAdmin, registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
