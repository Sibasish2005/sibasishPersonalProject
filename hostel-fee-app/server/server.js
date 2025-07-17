const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import route modules
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payments");
const adminRoutes = require("./routes/admin");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas (or local MongoDB)
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/*
  Routes:
    - /api/auth: Registration and login endpoints.
    - /api/payments: Payment order creation and confirmation.
    - /api/admin: Admin dashboard to view all student payments.
*/
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));