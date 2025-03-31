
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/verify-payment", async (req, res) => {
  const { paymentId } = req.body;
  const secretKey = "sk_test_bb8a2b86Q4MKg9l33d240ce99d2c"; // private key

  try {
    const response = await axios.get(`https://online.yoco.com/v1/payments/${paymentId}`, {
      headers: { "X-Auth-Secret-Key": secretKey }
    });

    if (response.data.status === "successful" && response.data.amountInCents === amountPaid) {
      res.json({ success: true, message: "Payment verified!" });
    } else {
      res.json({ success: false, message: "Payment not successful or incorrect amount." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying payment." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
