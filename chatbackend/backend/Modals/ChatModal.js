const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    chatname: {
        type: String
    },
    isgroupchat: {
        type: Boolean,
        default: false
    },
    users: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'  
        }
    ],
    groupadmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },
    latestmessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'  
    }
}, { timestamps: true }); 

module.exports = mongoose.model("Chat", ChatSchema);
