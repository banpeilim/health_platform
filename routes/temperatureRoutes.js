const express = require("express");
const router = express.Router();
const Temperature = require("../models/Temperature");

router.post("/", async (req, res) => {
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
