
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const personSchema=new mongoose.Schema({
    name:{type:String,required:true},
    age:{type:String},
    work:{type:String,enum:['chef','waiter','manager'],required:true},
    mobile:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    address:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String,required:true},
});

personSchema.pre('save',async function(next){
    const person=this;
    if(!person.isModified('password')) return next();
    try{
        const salt=await bcrypt.genSalt(10);
        const hashPass=await bcrypt.hash(person.password,salt);
        person.password=hashPass;
        next();
    }
    catch(err){
        return next(err);
    }
})
personSchema.methods.comparePassword=async function(candidatePassword){
    try{
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }
    catch(err){
        throw err;
    }
}
const Person=mongoose.model('Person',personSchema);
module.exports=Person;