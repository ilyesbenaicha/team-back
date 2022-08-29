const mongoose = require('mongoose')


const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect("mongodb+srv://admin:admin@cluster0.wex35.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
        console.log(`mongo db connected : ${conn.connection.host}` .cyan.underline)
    } catch (error){
console.log(error);
process.exit(1)
    }
}
module.exports = connectDB