const express= require('express')
const router = express.Router()
 const {} = require('../controllers/ProjectController');
const { getTask, addTask, updateTask, deleteTask } = require('../controllers/tacheController');
const IssuperAdmin = require('../middleware/superAdminMiddleware').default;
const adminMiddleware = require('../middleware/superAdminMiddleware').default;

const { protect } = require("../middleware/authMiddleware");

router.route('/').get(protect,getTask).post(protect,addTask)
router.route('/:id').put(protect,updateTask).delete(protect,adminMiddleware,deleteTask)

 module.exports = router