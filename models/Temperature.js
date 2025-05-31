const mongoose = require("mongoose");

const tempSchema = new mongoose.Schema({
  ambientTemp: { type: Number, required: true },
  skinTemp: { type: Number, required: true },
  userId: { type: String, required: true }, // Added userId field
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Temperature", tempSchema);
