const express = require('express');
const { LoginAuth, RegisterAuth, alluser } = require('../Controllers/userauth');
const protect = require('../Middleware/authmiddleware');
const router = express.Router();

router.post('/Register', RegisterAuth);  
router.post('/Login', LoginAuth);        
router.get('/', protect, alluser);   

module.exports = router;
