const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection Error:");
    console.error(err);
    process.exit(1);
  });