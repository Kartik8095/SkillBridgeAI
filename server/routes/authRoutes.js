const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  register,
  login,
  profile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.get("/profile", verifyToken, profile);

router.put("/update", verifyToken, updateProfile);

router.put("/change-password", verifyToken, changePassword);

module.exports = router;