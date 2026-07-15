const express = require("express");
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

const {
  uploadResume,
  getMyResumes,
  deleteResume,
  analyzeResume,
  getDashboardStats,
  getProfile,
  updateProfile,
  getCareerCoach,
} = require("../controllers/resumeController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Profile
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

// Resume
router.post(
  "/upload",
  verifyToken,
  upload.single("resume"),
  uploadResume
);

router.get("/my", verifyToken, getMyResumes);

router.delete("/delete/:id", verifyToken, deleteResume);

router.get(
  "/analyze/:filename",
  verifyToken,
  analyzeResume
);

// Dashboard
router.get(
  "/dashboard",
  verifyToken,
  getDashboardStats
);

// Career Coach
router.get(
  "/career-coach",
  verifyToken,
  getCareerCoach
);

module.exports = router;