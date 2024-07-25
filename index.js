const express = require('express');
var cors = require('cors');
var Razorpay = require('razorpay');

// const connectDb = require('./database/connectDb');

const app = express();
app.use(cors())
const port = process.env.PORT || 1000;

// connect to db
// connectDb();

// middlewares
app.use(express.json({ extended: false }));

app.post('/orders', async (req, res) => {
  
    const instance = new Razorpay({
      key_id: 'rzp_live_fdzzmLwhLkMcG6', // YOUR RAZORPAY KEY
      key_secret: '4XkAfLYwF4dHruHVuoDAVOK7', // YOUR RAZORPAY SECRET
    });

    const options = {
      amount: req.body.amount,
      currency: req.body.currency,
      receipt: 'receipt_order_74394',
      payment_capture: 1
    };
  try {
    const order = await instance.orders.create(options);

    // if (!order) return res.status(500).send('Some error occured');

    res.json({
      order: order.id,
      currency: order.currency,
      amount: order.amount
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.get("/payment/:paymentId", async(req, res) => {
  const {paymentId} = req.params;

  const instance = new Razorpay({
    key_id: 'rzp_test_xVhe8Kc1nyWe7C', // YOUR RAZORPAY KEY
    key_secret: 'oLB0srccl9rdKhIuANOzOgd9', // YOUR RAZORPAY SECRET
  });

  try {
    const payment = await instance.payments.fetch(paymentId);

    if(!payment) res.status(500).json("error at razorpay loading");

    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency
    })
  } catch(error) {
    res.status(500).json("FAILED TO FETCH THE PAYMENT")
  }
})

app.listen(port, () => console.log(`server started on port ${port}`));
