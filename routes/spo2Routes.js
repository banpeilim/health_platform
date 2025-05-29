const express = require("express");
const router = express.Router();
const SpO2 = require("../models/SpO2");

router.post("/", async (req, res) => {
  try {
    const { percentage } = req.body;
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

router.get("/", async (req, res) => {
  try {
    const { limit, from, to } = req.query;
    let query = SpO2.find();
    if (from) query = query.where("timestamp").gte(new Date(from));
    if (to) query = query.where("timestamp").lte(new Date(to));
    query = query.sort({ timestamp: -1 });
    if (limit) query = query.limit(parseInt(limit));
    const spo2Readings = await query.exec();
    res.status(200).json(spo2Readings);
  } catch (error) {
    console.error("Error retrieving SpO2 readings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
