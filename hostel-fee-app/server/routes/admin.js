const express = require("express");
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to allow only admin access
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access Denied: Admins only" });
  next();
};

router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Optionally, populate the user's name and email from the User model
    const payments = await Payment.find().populate("userId", "name email");
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

module.exports = router;