const express= require('express')
const { getCalander, addCalander } = require('../controllers/calanderController')
const router = express.Router()

router.route('/').get(getCalander).post(addCalander)

module.exports=router