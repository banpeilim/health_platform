const mongoose = require("mongoose");

const heartRateSchema = new mongoose.Schema({
  bpm: { type: Number, required: true, min: 20, max: 250 },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HeartRate", heartRateSchema);
