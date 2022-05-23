 const express= require('express')
const router = express.Router()
 const {getproject,addproject,deletproject,updateproject} = require('../controllers/ProjectController');
const adminMiddleware = require('../middleware/adminMiddleware');
 const { protect } = require("../middleware/authMiddleware");

router.route('/').get(protect,getproject).post(protect,adminMiddleware,addproject)
router.route('/:id').put(protect,updateproject).delete(protect,adminMiddleware,deletproject)

 module.exports = router