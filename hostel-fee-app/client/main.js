// Base URL where the backend API is running
const backendUrl = "http://localhost:5000/api";

// We'll store the JWT auth token here for subsequent requests
let authToken = "";

// Registration: Listen for the register form submission
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  try {
    const res = await fetch(`${backendUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registration Successful!");
      authToken = data.token;
      // Hide registration and login, then reveal payment section
      document.getElementById("register-section").style.display = "none";
      document.getElementById("login-section").style.display = "none";
      document.getElementById("payment-section").style.display = "block";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Registration error:", err);
  }
});

// Login: Listen for the login form submission
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Login Successful!");
      authToken = data.token;
      document.getElementById("register-section").style.display = "none";
      document.getElementById("login-section").style.display = "none";
      document.getElementById("payment-section").style.display = "block";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Login error:", err);
  }
});

// Payment: Listen for payment form submission
document.getElementById("payment-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = document.getElementById("payment-amount").value;

  try {
    // Create the Razorpay order
    const res = await fetch(`${backendUrl}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (res.ok) {
      // In a real-world scenario, you would call Razorpay’s checkout modal here.
      console.log("Order created:", data.order);

      // Simulate payment confirmation (In production, use Razorpay webhook/checkout callback)
      const confirmRes = await fetch(`${backendUrl}/payments/confirm-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          razorpay_payment_id: "SIMULATED_PAY_ID",
          razorpay_order_id: data.order.id,
          paymentDbId: data.paymentId,
        }),
      });
      const confirmData = await confirmRes.json();
      if (confirmRes.ok) {
        alert("Payment Confirmed!");
        // Hide payment section and show receipt
        document.getElementById("payment-section").style.display = "none";
        document.getElementById("receipt-section").style.display = "block";
        document.getElementById("receipt-details").innerHTML = `
          <p><strong>Payment ID:</strong> ${confirmData.payment.paymentId}</p>
          <p><strong>Order ID:</strong> ${confirmData.payment.orderId}</p>
          <p><strong>Status:</strong> ${confirmData.payment.status}</p>
          <p><strong>Amount:</strong> ${confirmData.payment.amount}</p>
        `;
      } else {
        alert(confirmData.message);
      }
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Payment error:", err);
  }
});