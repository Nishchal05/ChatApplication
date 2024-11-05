import React, { useState, useContext } from 'react';
import { UserContext } from '../../contextapi';
import { Backendlink } from '../../Backendlink';
const PaymentPage = () => {
  const { user, selectedChat } = useContext(UserContext); // Access user and chat from context
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    if (!user?.id || !selectedChat?._id) {
      alert("User or chat information is missing!");
      return;
    }
  
    try {
      const response = await fetch(`${Backendlink}/api/payment/order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          senderId: user.id,          // Sender's ID (user)
          receiverId: selectedChat._id, // Receiver's ID (selected chat)
          chatId: selectedChat._id,   // Associate with selected chat
        }),
      });
  
      const data = await response.json();

      console.log('API Response:', data);
      if (data) {
        const options = {
          
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: data.amount, 
          currency: "INR",
          name: process.env.REACT_APP_RAZORPAY_KEY_ID,
          description: "Test Transaction",
          image: "/logo.png",
          order_id: data.id,
          handler: async function (response) {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
  
            // Verify the payment with the backend
            const verifyResponse = await fetch(`${Backendlink}/api/payment/verify`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                paymentId: data.paymentId,
              }),
            });
  
            const result = await verifyResponse.json();
            console.log(result);
            alert("Payment Successful");
          },
          prefill: {
            name: user?.name || "Your Name",
            email: user?.email || "your.email@example.com",
            contact: user?.contact || "9999999999",
          },
          notes: {
            address: "Your Address",
          },
          theme: {
            color: "#3399cc",
          },
        };
  
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Payment failed', error);
      alert('Something went wrong with the payment!');
    }
  };  

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',border:'1px solid white',padding:'15px',height:'200px',backdropFilter:'blur(30px)'}}>
    <h1 style={{color:'white',fontSize:'2rem'}}>LIVECHAT.pay</h1>
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{backgroundColor:'transparent',color:'white'}}
      />
      <button style={{width:'fit-content'}} onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;
