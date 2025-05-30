const express = require("express");
const router = express.Router();
const HeartRate = require("../models/HeartRate");

router.post("/", async (req, res) => {
  try {
    const { bpm, userId } = req.body;

    // Validate bpm
    if (typeof bpm !== "number" || bpm < 20 || bpm > 250) {
      return res.status(400).json({
        error: "Heart rate must be a number between 20 and 250 BPM",
      });
    }

    // Validate userId
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return res.status(400).json({
        error: "Valid userId is required",
      });
    }

    // Create and save new record
    const newHeartRate = new HeartRate({
      bpm,
      userId: userId.trim(), // Store trimmed version
    });

    const savedHeartRate = await newHeartRate.save();
    res.status(201).json(savedHeartRate);
  } catch (error) {
    console.error("Error saving heart rate:", error);
    res.status(500).json({
      error: "Server error while saving heart rate data",
    });
  }
});

router.get("/", async (req, res) => {
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

module.exports = router;
