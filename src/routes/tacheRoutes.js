const express= require('express')
const router = express.Router()
 const {} = require('../controllers/projectController');
const { getTask, addTask, updateTask, deleteTask,updateTaskByName, getTaskBystatus, getTaskByUser, getTaskDone,getTaskByProject } = require('../controllers/tacheController');
const IssuperAdmin = require('../middleware/superAdminMiddleware');
const adminMiddleware = require('../middleware/superAdminMiddleware');

const { protect } = require("../middleware/authMiddleware");
router.route('/').get(protect,getTask)
router.post('/addTask/',addTask)
router.route('/:id').put(protect,updateTask).delete(protect,adminMiddleware,deleteTask)
router.route('/update/:title').put(protect,updateTaskByName)
router.route('/getStatus').get(getTaskBystatus)
router.route('/getTaskByuser/:id').get(getTaskByUser)
router.route('/taskDone').get(getTaskDone)
router.route('/getTaskByProject/:id').get(getTaskByProject)
module.exports = router