const jwt=require("jsonwebtoken")
const UserModal=require("../Modals/UserModal");
const protect=async(req,res,next)=>{
    let token;
    if(req.headers.authorization){
        try{
            token=req.headers.authorization.split(" ")[1];
            const decoded=jwt.verify(token,process.env.SECURITY_CODE);
            req.user=await UserModal.findById(decoded.id).select("-password");
            next();
        }
        catch(error){
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    };
    if(!token){
        res.status(401);
        throw new Error("Not authorized");
    }
}
module.exports=protect;