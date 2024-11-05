const mongoose=require('mongoose');
const MessageModal=mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type:String,
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }
},{timestamp:true})
module.exports=mongoose.model("Message",MessageModal);