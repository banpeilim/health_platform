const express = require("express");
const router = express.Router();
const SpO2 = require("../models/SpO2");

router.post("/", async (req, res) => {
  try {
    const { percentage, userId } = req.body;

    // Validate SpO2 percentage
    if (typeof percentage !== "number" || percentage < 70 || percentage > 100) {
      return res.status(400).json({
        error: "SpO2 must be a number between 70 and 100%",
      });
    }

    // Validate userId
    if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
      return res.status(400).json({
        error: "Valid userId is required",
      });
    }

    // Create and save new record
    const newSpO2 = new SpO2({
      percentage,
      userId: userId.trim(),
    });

    const savedSpO2 = await newSpO2.save();
    res.status(201).json(savedSpO2);
  } catch (error) {
    console.error("Error saving SpO2:", error);
    res.status(500).json({
      error: "Server error while saving SpO2 data",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
