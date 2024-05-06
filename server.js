const express=require('express');
const app=express();
const db=require('./db');
const MenuItem=require('./models/menu')
const bodyParser=require('body-parser');
const Person = require('./models/person');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
require('dotenv').config();
app.use(bodyParser.json());
const logRequest=(req,res,next)=>{
    console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl}`);
    next();
}
// const localAuthMiddleware=passport.authenticate('local',{session:false});
app.get('/',function(req,res){
    res.send('welcome my friend');
})              
app.use(logRequest);
app.listen(3000,()=>{
    console.log('listening on port 3000');
})
// app.use(passport.initialize());
passport.use(new LocalStrategy(async (USERNAME,password,done)=>{
    try{
        console.log("recievd credetials :",USERNAME,password);
        const user=await Person.findOne({username:USERNAME});
        if(!user){
            return done(null,false,{message:'Incorrect username'});
        }
        const isPasswordMatch=await user.comparePassword(password);
        if(isPasswordMatch){
            return done(null,user);
        }else{
            return done(null,false,{message:'Incorrect password'});
        }

    }
    catch(err){
        return done(err);
    }
}))
app.post('/person',async (req,res)=>{
    try{

        const data=req.body;
        const newPerson=new Person(data);
        const response=await newPerson.save();
        console.log("data saved successfully");
        res.status(200).json(response);
    }catch(err){
        console.log('Error saving person',err);
        res.status(500).json({error:err})
    }
});
app.post('/menu',async (req,res)=>{
    try{
        const data=req.body;
        const menuItem=new MenuItem(data);
        const response= await menuItem.save();
        res.status(200).json(response);
    }catch(err){
        console.log('Error saving person',err);
        res.status(500).json({error:err})
    }
})
app.put('/person/:id',async(req,res)=>{
    try{
        const personID=req.params.id;
        const updatedPersonData=req.body;
        const response=await Person.findByIdAndUpdate(personID,updatedPersonData,{
            new:true,
            runValidators:true,
        });
        if(!response){
            return res.status(404).json({error:'Person not found'});
        }
        console.log('data updated');
        res.status(200).json(response);
        
    }
    catch(err){
        console.log('Error saving person',err);
        res.status(500).json({error:err})
    }
})
app.get('/person',async (req,res)=>{
    try{
        const data=await Person.find();
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})