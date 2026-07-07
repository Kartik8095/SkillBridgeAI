const db = require("../config/db");

exports.uploadResume = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const userId = req.user.id;

  db.query(
    "INSERT INTO resumes(user_id, filename, original_name) VALUES (?, ?, ?)",
    [
      userId,
      req.file.filename,
      req.file.originalname,
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      res.json({
        success: true,
        message: "Resume uploaded successfully",
      });
    }
  );
};

exports.getMyResumes = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM resumes WHERE user_id = ? ORDER BY uploaded_at DESC",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      res.json({
        success: true,
        resumes: results,
      });
    }
  );
};

const fs = require("fs");
const path = require("path");

exports.deleteResume = (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user.id;

  db.query(
    "SELECT * FROM resumes WHERE id = ? AND user_id = ?",
    [resumeId, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }

      const filename = result[0].filename;
      const filePath = path.join(__dirname, "../uploads", filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      db.query(
        "DELETE FROM resumes WHERE id = ?",
        [resumeId],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Delete failed",
            });
          }

          res.json({
            success: true,
            message: "Resume deleted successfully",
          });
        }
      );
    }
  );
};