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

// Database Models
// Temperature Data Schema
const tempSchema = new mongoose.Schema({
  ambientTemp: { type: Number, required: true },
  skinTemp: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Heart Rate Data Schema
const heartRateSchema = new mongoose.Schema({
  bpm: { type: Number, required: true, min: 20, max: 250 }, // Reasonable heart rate range
  timestamp: { type: Date, default: Date.now },
});

const Temperature = mongoose.model("Temperature", tempSchema);
const HeartRate = mongoose.model("HeartRate", heartRateSchema);

// Database Connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ Connected to database"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Temperature Endpoints

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

// GET Endpoint for Temperature Data
app.get("/api/temperatures", async (req, res) => {
  try {
    // Optional query parameters for filtering
    const { limit, from, to } = req.query;

    let query = Temperature.find();

    // Date range filtering
    if (from) {
      query = query.where("timestamp").gte(new Date(from));
    }
    if (to) {
      query = query.where("timestamp").lte(new Date(to));
    }

    // Sorting and limiting
    query = query.sort({ timestamp: -1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const temperatures = await query.exec();
    res.status(200).json(temperatures);
  } catch (error) {
    console.error("Error retrieving temperatures:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Heart Rate Endpoints

// POST Endpoint for Heart Rate Data
app.post("/api/heart-rates", async (req, res) => {
  try {
    const { bpm } = req.body;

    // Validation
    if (typeof bpm !== "number" || bpm < 20 || bpm > 250) {
      return res.status(400).json({ error: "Invalid heart rate value" });
    }

    const newHeartRate = new HeartRate({
      bpm,
    });

    const savedHeartRate = await newHeartRate.save();
    res.status(201).json(savedHeartRate);
  } catch (error) {
    console.error("Error saving heart rate:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET Endpoint for Heart Rate Data
app.get("/api/heart-rates", async (req, res) => {
  try {
    // Optional query parameters for filtering
    const { limit, from, to } = req.query;

    let query = HeartRate.find();

    // Date range filtering
    if (from) {
      query = query.where("timestamp").gte(new Date(from));
    }
    if (to) {
      query = query.where("timestamp").lte(new Date(to));
    }

    // Sorting and limiting
    query = query.sort({ timestamp: -1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const heartRates = await query.exec();
    res.status(200).json(heartRates);
  } catch (error) {
    console.error("Error retrieving heart rates:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
