const mongoose = require("mongoose");

const spo2Schema = new mongoose.Schema({
  percentage: {
    type: Number,
    required: true,
    min: 70,
    max: 100,
  },
  userId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Add index on timestamp for better query performance on time-based data
spo2Schema.index({ timestamp: 1 });

module.exports = mongoose.model("SpO2", spo2Schema);
