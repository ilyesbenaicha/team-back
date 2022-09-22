const express= require('express')
const router = express.Router()
 const {getproject,addproject,deletproject,updateproject,getprojectByuser} = require('../controllers/ProjectController');
const IssuperAdmin = require('../middleware/superAdminMiddleware');
 const { protect } = require("../middleware/authMiddleware");

router.route('/').get(protect,getproject).post(protect,addproject)
router.route('/:id').put(protect,updateproject).delete(protect,IssuperAdmin,deletproject)
router.get("/getprojectByuser/:user",getprojectByuser)
 module.exports = router