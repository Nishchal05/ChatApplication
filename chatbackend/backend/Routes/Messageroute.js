const express = require('express');
const  protect  = require('../Middleware/authmiddleware');
const { allMessages, sendMessage } = require('../Controllers/messagecontroller');
const router = express.Router();

router.route('/:chatId').get(protect, allMessages); 
router.route('/').post(protect, sendMessage); 

module.exports = router;
