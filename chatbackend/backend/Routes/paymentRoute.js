const express=require('express');
const protect=require('../Middleware/authmiddleware');
const razorpay = require('razorpay');
const {ordercontroller,paymentcontroller,verifyPaymentController}=require("../Controllers/paymentcontrollers")
require('dotenv').config();
const Router=express.Router();
Router.route('/Detail').get(protect,paymentcontroller);
Router.route('/order').post(protect,ordercontroller);
Router.route('/verify').post(protect,verifyPaymentController);
module.exports=Router;