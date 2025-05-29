const mongoose = require("mongoose");

const spo2Schema = new mongoose.Schema({
  percentage: { type: Number, required: true, min: 70, max: 100 },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SpO2", spo2Schema);
