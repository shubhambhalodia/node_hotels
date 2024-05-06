const mongoose=require('mongoose');
require('dotenv').config();
// const mongoURL='mongodb://127.0.0.1:27017/hotel'
const mongoURL=process.env.DB_URL;
mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db=mongoose.connection;
db.on('connected',()=>{
    console.log("connected to mongodb server");
})
db.on('error',(error)=>{
console.log("error: " + error);
})
db.on('disconnected',()=>{
console.log("mongodb disconnected ");
})
module.exports=db;