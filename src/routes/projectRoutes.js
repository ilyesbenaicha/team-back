 const express= require('express')
const router = express.Router()
 const {getproject,addproject,deletproject,updateproject} = require('../controllers/ProjectController');
const IssuperAdmin = require('../middleware/superAdminMiddleware');
 const { protect } = require("../middleware/authMiddleware");

router.route('/').get(protect,getproject).post(protect,IssuperAdmin,addproject)
router.route('/:id').put(protect,updateproject).delete(protect,IssuperAdmin,deletproject)

 module.exports = router