const express = require("express");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize Razorpay instance using keys from your .env file
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Order Endpoint
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body; // amount should be in paise for INR
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await razorpayInstance.orders.create(options);

    // Save the initial order/payment details to your database
    const newPayment = new Payment({
      userId: req.user.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
    });
    await newPayment.save();

    res.json({ order, paymentId: newPayment._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating order" });
  }
});

// Confirm Payment Endpoint
router.post("/confirm-payment", authMiddleware, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, paymentDbId } = req.body;
    // In production: verify signature and perform security checks
    const payment = await Payment.findById(paymentDbId);
    if (!payment)
      return res.status(404).json({ message: "Payment record not found" });
    payment.paymentId = razorpay_payment_id;
    payment.status = "paid";
    await payment.save();
    res.json({ message: "Payment confirmed", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error confirming payment" });
  }
});

module.exports = router;