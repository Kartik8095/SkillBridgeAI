const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {

    register,
    login,
    profile

} = require("../controllers/authController");


router.post("/register", register);

router.post("/login", login);

router.get("/profile", verifyToken, profile);

module.exports = router;