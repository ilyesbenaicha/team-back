const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {errorHandler} = require('./src/middleware/errorMiddleware')
const connectDB = require('./src/config/db')
const port = process.env.PORT || 5000
connectDB()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    const allowedOrigins = ["http://localhost:3000", "http://www.teams.mobelite.fr/" ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
  });
// app.use(cors(
// {    origin: "http://www.teams.mobelite.fr/",
//     credentials: true
// }));
app.use('/api/user', require('./src/routes/userRoutes'))
app.use ('/api/project', require('./src/routes/projectRoutes'))
app.use('/api/task', require('./src/routes/tacheRoutes'))
app.use('/api/calander',require('./src/routes/calanderRoutes'))
app.use(errorHandler)
app.listen(port, ()=> console.log(`Server started on port ${port}`))
