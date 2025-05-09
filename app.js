// app.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Temperature Data Schema
const tempSchema = new mongoose.Schema({
  ambientTemp: { type: Number, required: true },
  skinTemp: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Temperature = mongoose.model("Temperature", tempSchema);

// Database Connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ Connected to database"))
  .catch((err) => console.error("❌ Database connection error:", err));

// POST Endpoint for Temperature Data
app.post("/api/temperatures", async (req, res) => {
  try {
    const { ambientTemp, skinTemp } = req.body;

    // Basic validation
    if (typeof ambientTemp !== "number" || typeof skinTemp !== "number") {
      return res.status(400).json({ error: "Invalid temperature values" });
    }

    const newTemp = new Temperature({
      ambientTemp,
      skinTemp,
    });

    const savedTemp = await newTemp.save();
    res.status(201).json(savedTemp);
  } catch (error) {
    console.error("Error saving temperature:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/temperatures", async (req, res) => {
  try {
    // Find all temperature records and sort by timestamp in descending order (newest first)
    const temperatures = await Temperature.find().sort({ timestamp: -1 });

    res.status(200).json(temperatures);
  } catch (error) {
    console.error("Error retrieving temperatures:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
