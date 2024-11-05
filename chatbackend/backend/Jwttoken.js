const jwt=require('jsonwebtoken');
const tokengenerater=(id)=>{
    return jwt.sign({id},process.env.SECURITY_CODE,{
        expiresIn:"1d",
    })
}
module.exports=tokengenerater;