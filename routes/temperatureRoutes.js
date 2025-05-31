const express = require("express");
const router = express.Router();
const Temperature = require("../models/Temperature");

router.post("/", async (req, res) => {
  try {
    const { ambientTemp, skinTemp, userId } = req.body;

    // Validate input types
    if (typeof ambientTemp !== "number" || typeof skinTemp !== "number") {
      return res
        .status(400)
        .json({ error: "Temperature values must be numbers" });
    }

    if (typeof userId !== "string" || userId.trim() === "") {
      return res.status(400).json({ error: "Valid userId is required" });
    }

    const newTemp = new Temperature({
      ambientTemp,
      skinTemp,
      userId,
    });

    const savedTemp = await newTemp.save();
    res.status(201).json(savedTemp);
  } catch (error) {
    console.error("Error saving temperature:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
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

module.exports = router;
