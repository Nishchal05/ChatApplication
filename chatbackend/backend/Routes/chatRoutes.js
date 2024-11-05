const express = require('express');
const protect = require('../Middleware/authmiddleware');
const { accesschat, fetchchats, createChat: creategroupchat,updatechatgroup,addtogroup,removefromgroup} = require('../Controllers/chatcontroller'); // Destructure the required functions
const router = express.Router();

// Routes
router.route("/").post(protect, accesschat); 
router.route("/").get(protect, fetchchats); 
router.route("/group").post(protect, creategroupchat); 
router.route("/rename").put(protect, updatechatgroup);
router.route("/removegroup").put(protect, removefromgroup);
router.route("/groupadd").put(protect, addtogroup);

module.exports = router;
