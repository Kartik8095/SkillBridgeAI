const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

// MySQL Connection
require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 SkillBridge AI Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});