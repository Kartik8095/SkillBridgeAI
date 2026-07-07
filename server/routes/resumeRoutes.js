const express = require("express");
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

const {
  uploadResume,
  getMyResumes,
  deleteResume
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

router.post(
  "/upload",
  verifyToken,
  upload.single("resume"),
  uploadResume
);



router.get("/my", verifyToken, getMyResumes);
router.delete("/delete/:id", verifyToken, deleteResume);
module.exports = router;