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
const tempSchema = new mongoose.Schema({
  ambientTemp: { type: Number, required: true },
  skinTemp: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const heartRateSchema = new mongoose.Schema({
  bpm: { type: Number, required: true, min: 20, max: 250 },
  timestamp: { type: Date, default: Date.now },
});

const spo2Schema = new mongoose.Schema({
  percentage: { type: Number, required: true, min: 70, max: 100 }, // Normal SpO2 range
  timestamp: { type: Date, default: Date.now },
});

const Temperature = mongoose.model("Temperature", tempSchema);
const HeartRate = mongoose.model("HeartRate", heartRateSchema);
const SpO2 = mongoose.model("SpO2", spo2Schema);

// Database Connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ Connected to database"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Temperature Endpoints (unchanged)
app.post("/api/temperatures", async (req, res) => {
  try {
    const { ambientTemp, skinTemp } = req.body;
    if (typeof ambientTemp !== "number" || typeof skinTemp !== "number") {
      return res.status(400).json({ error: "Invalid temperature values" });
    }
    const newTemp = new Temperature({ ambientTemp, skinTemp });
    const savedTemp = await newTemp.save();
    res.status(201).json(savedTemp);
  } catch (error) {
    console.error("Error saving temperature:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/temperatures", async (req, res) => {
  try {
    const { limit, from, to } = req.query;
    let query = Temperature.find();
    if (from) query = query.where("timestamp").gte(new Date(from));
    if (to) query = query.where("timestamp").lte(new Date(to));
    query = query.sort({ timestamp: -1 });
    if (limit) query = query.limit(parseInt(limit));
    const temperatures = await query.exec();
    res.status(200).json(temperatures);
  } catch (error) {
    console.error("Error retrieving temperatures:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Heart Rate Endpoints (unchanged)
app.post("/api/heart-rates", async (req, res) => {
  try {
    const { bpm } = req.body;
    if (typeof bpm !== "number" || bpm < 20 || bpm > 250) {
      return res.status(400).json({ error: "Invalid heart rate value" });
    }
    const newHeartRate = new HeartRate({ bpm });
    const savedHeartRate = await newHeartRate.save();
    res.status(201).json(savedHeartRate);
  } catch (error) {
    console.error("Error saving heart rate:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/heart-rates", async (req, res) => {
  try {
    const { limit, from, to } = req.query;
    let query = HeartRate.find();
    if (from) query = query.where("timestamp").gte(new Date(from));
    if (to) query = query.where("timestamp").lte(new Date(to));
    query = query.sort({ timestamp: -1 });
    if (limit) query = query.limit(parseInt(limit));
    const heartRates = await query.exec();
    res.status(200).json(heartRates);
  } catch (error) {
    console.error("Error retrieving heart rates:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// SpO2 Endpoints (new)
app.post("/api/spo2", async (req, res) => {
  try {
    const { percentage } = req.body;

    // Validate SpO2 value (normal range: 95-100%, but can be lower)
    if (typeof percentage !== "number" || percentage < 70 || percentage > 100) {
      return res
        .status(400)
        .json({ error: "Invalid SpO2 value (must be between 70-100)" });
    }

    const newSpO2 = new SpO2({ percentage });
    const savedSpO2 = await newSpO2.save();
    res.status(201).json(savedSpO2);
  } catch (error) {
    console.error("Error saving SpO2:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/spo2", async (req, res) => {
  try {
    const { limit, from, to } = req.query;
    let query = SpO2.find();

    // Date range filtering
    if (from) query = query.where("timestamp").gte(new Date(from));
    if (to) query = query.where("timestamp").lte(new Date(to));

    // Sorting and limiting
    query = query.sort({ timestamp: -1 });
    if (limit) query = query.limit(parseInt(limit));

    const spo2Readings = await query.exec();
    res.status(200).json(spo2Readings);
  } catch (error) {
    console.error("Error retrieving SpO2 readings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
