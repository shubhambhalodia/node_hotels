const jwt=require('jsonwebtoken');
const jsonAuthMiddleware=(req,res,next)=>{
    const token=req.headerss.authorization.split(' ')[1];
    if(!token)return res.status(401).json({error:'Unauthorized'});
    try{
        const decoded=jwt.verify(token,process.env.)
    }
    catch(err){
        console.error(err);
        res.status(401).json({error:'invalid token'});
    }
}