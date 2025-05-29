const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const temperatureRoutes = require("./routes/temperatureRoutes");
const heartRateRoutes = require("./routes/heartRateRoutes");
const spo2Routes = require("./routes/spo2Routes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
connectDB();

// Routes
app.use("/api/temperatures", temperatureRoutes);
app.use("/api/heart-rates", heartRateRoutes);
app.use("/api/spo2", spo2Routes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
