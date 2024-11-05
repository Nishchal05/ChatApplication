const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.RAZORPAY_KEY_ID, process.env.ROZARPAY_SECRET);
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
const paymentcontroller = async (req, res) => {
    res.json({ message: "payment details" });
};

const ordercontroller = async (req, res) => {
  const { amount, chatId, senderId, receiverId } = req.body;

  // Log the incoming request
  console.log('Request Body:', req.body);

  try {
      if (!chatId || !senderId || !receiverId) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      const options = {
          amount: Number(amount),
          currency: "INR",
          receipt: crypto.randomBytes(10).toString("hex"),
      };

      instance.orders.create(options, (error, order) => {
          if (error) {
              console.log(error); 
              return res.status(500).json({ message: "Something went wrong!" });
          }

          const payment = new Payment({
              chatId,
              sender_id: senderId,
              receiver_id: receiverId,
              signature: "",
              date: new Date(),
          });

          payment.save(); 

          res.status(200).json({ data: order, paymentId: payment._id });
          console.log(order); 
      });
  } catch (error) {
      console.log(error); 
      res.status(500).json({ message: "Internal server error!" });
  }
};


  const verifyPaymentController = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required payment information" });
    }
  
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");
  
    if (digest === razorpay_signature) {
      await Payment.findByIdAndUpdate(paymentId, { signature: razorpay_signature });
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
    
  };
  

module.exports = { ordercontroller, paymentcontroller, verifyPaymentController };
