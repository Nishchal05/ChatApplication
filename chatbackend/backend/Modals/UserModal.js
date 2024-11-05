const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
const User=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    number:{
        type:Number,
        require:true,
    },
    profile:{
        type:String,
        required:true,
        default:"https://th.bing.com/th/id/OIP.UhimkHoza55A0VpXinqKgQHaHa?rs=1&pid=ImgDetMain",
    }
},{timestamp:true})
User.methods.comparepass=async function(password){
    return await bcrypt.compare(password,this.password)
}
User.pre('save',async function (next){
    if (!this.isModified('password')) {
        return next(); 
    }
    const salt =await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})
module.exports=mongoose.model("User",User);