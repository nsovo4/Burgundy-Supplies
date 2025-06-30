
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); 
app.use(express.json());

const yocoSecretKey = "sk_test_bb8a2b86Q4MKg9l33d240ce99d2c";
const shipLogicAuthToken = "6127a62cc60441c49f65e66c35f320eb";

// Verify Yoco Payment
app.post("/verify-payment", async (req, res) => {
  const { paymentId, amountPaid } = req.body;

  try {
    const response = await axios.get(`https://online.yoco.com/v1/payments/${paymentId}`, {
      headers: { "X-Auth-Secret-Key": yocoSecretKey }
    });

    if (response.data.status === "successful" && response.data.amountInCents === amountPaid) {
      res.json({ success: true, message: "Payment verified!" });
    } else {
      res.json({ success: false, message: "Payment not successful or incorrect amount." });
    }
  } catch (error) {
    console.error("Payment verification error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Error verifying payment." });
  }
});

// Create shipment after successful payment
app.post("/create-shipment", async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    suburb,
    city,
    postal_code
  } = req.body;

  const shipmentData = {
    collection_address: {
      type: "business",
      company: "Burgundy Suppliers",
      street_address: "Itala Pl",
      local_area: "Mooikloof",
      city: "Pretoria",
      code: "0081",
      zone: "Gauteng",
      country: "ZA",
      lat: "-25.8443564",
      lng: "28.3243642",
    },
    collection_contact: {
      name: "Burgundy Suppliers",
      phone: "073 220 5135",
      email: "Orders@burgundysuppliers.co.za",
    },
    delivery_address: {
      name,
      address,
      city,
      email,
      phone,
      postal_code,
      suburb,
    },
    delivery_contact: {
      name,
      email,
      phone,
    },

    parcels: [
        {
            parcel_description: "Wild Yam Cream",
            submitted_length_cm: 10,
            submitted_width_cm: 10,
            submitted_height_cm: 10,
            submitted_weight_kg: 0.2
        }
    ],
    special_instructions_collection: "This is a test shipment - DO NOT COLLECT",
    special_instructions_delivery: "This is a test shipment - DO NOT DELIVER",
    declared_value: 1100,
    collection_min_date: "2021-05-21T00:00:00.000Z",
    collection_after: "08:00",
    collection_before: "16:00",
    delivery_min_date: "2021-05-21T00:00:00.000Z",
    delivery_after: "10:00",
    delivery_before: "17:00",
    custom_tracking_reference: "",
    customer_reference: "ORDERNO123",
    service_level_code: "ECO",
    mute_notifications: false,
    description: "Wild Yam Cream",
    service: "overnight"
};

  try {
    const response = await axios.post("https://api.shiplogic.com/v1/shipments", shipmentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: shipLogicAuthToken,
      },
    });

    res.json({ success: true, shipment: response.data });
  } catch (error) {
    console.error("Shipment creation error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Error creating shipment." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
