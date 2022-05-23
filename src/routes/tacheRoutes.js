 const express= require('express')
const router = express.Router()
 const {} = require('../controllers/ProjectController');
const { getTask, addTask, updateTask, deleteTask } = require('../controllers/tacheController');
const adminMiddleware = require('../middleware/adminMiddleware');
 const { protect } = require("../middleware/authMiddleware");

router.route('/').get(protect,getTask).post(protect,adminMiddleware,addTask)
router.route('/:id').put(protect,updateTask).delete(protect,adminMiddleware,deleteTask)

 module.exports = router