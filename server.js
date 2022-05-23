const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./src/middleware/errorMiddleware')
const connectDB = require('./src/config/db')
const port = process.env.PORT || 5000
connectDB()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/user', require('./src/routes/userRoutes'))
app.use ('/api/project', require('./src/routes/projectRoutes'))
app.use(errorHandler)
app.listen(port, ()=> console.log(`Server started on port ${port}`))
