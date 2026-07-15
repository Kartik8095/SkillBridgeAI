const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const pdfParse = require("pdf-parse");

const analyzeResume = require("../services/resumeAnalyzer");
const saveAnalysis = require("../services/resumeAnalysisSaver");

// ==============================
// Upload Resume
// ==============================

exports.uploadResume = (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded."
        });
    }

    const userId = req.user.id;

    db.query(
        `INSERT INTO resumes
        (user_id, filename, original_name)
        VALUES(?,?,?)`,
        [
            userId,
            req.file.filename,
            req.file.originalname
        ],
        (err) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            res.json({
                success: true,
                message: "Resume uploaded successfully."
            });

        }
    );

};
// ==============================
// Get My Resumes
// ==============================

exports.getMyResumes = (req, res) => {

    const userId = req.user.id;

    db.query(
        `SELECT *
         FROM resumes
         WHERE user_id = ?
         ORDER BY uploaded_at DESC`,
        [userId],
        (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            res.json({
                success: true,
                count: results.length,
                resumes: results
            });

        }
    );

};
// ==============================
// Delete Resume
// ==============================

exports.deleteResume = (req, res) => {

    const resumeId = req.params.id;
    const userId = req.user.id;

    db.query(
        `SELECT *
         FROM resumes
         WHERE id = ? AND user_id = ?`,
        [resumeId, userId],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found"
                });
            }

            const filename = result[0].filename;

            const filePath = path.join(
                __dirname,
                "../uploads",
                filename
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            db.query(
                "DELETE FROM resumes WHERE id = ?",
                [resumeId],
                (err) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            success: false,
                            message: "Delete failed"
                        });
                    }

                    res.json({
                        success: true,
                        message: "Resume deleted successfully"
                    });

                }
            );

        }
    );

};

// ==============================
// Analyze Resume
// ==============================

exports.analyzeResume = async (req, res) => {

    try {

        const { filename } = req.params;

        const filePath = path.join(
            __dirname,
            "../uploads",
            filename
        );

        if (!fs.existsSync(filePath)) {

            return res.status(404).json({
                success: false,
                message: "Resume file not found."
            });

        }

        // Read PDF
        const dataBuffer = fs.readFileSync(filePath);

        const pdfData = await pdfParse(dataBuffer);

        // AI Analysis
        const analysis = analyzeResume(pdfData.text);

        // Generate Hash
        const fileHash = crypto
            .createHash("sha256")
            .update(pdfData.text)
            .digest("hex");

        // Find Resume ID
        db.query(
            "SELECT id FROM resumes WHERE filename = ?",
            [filename],
            async (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database Error"
                    });

                }

                if (result.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message: "Resume not found."
                    });

                }

                const resumeId = result[0].id;

                // Save AI Analysis
                const saveResult =
                    await saveAnalysis(
                        resumeId,
                        analysis,
                        fileHash
                    );

                res.json({

                    success: true,

                    duplicate: saveResult.duplicate,

                    version: saveResult.version,

                    analysis

                });

            }

        );

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==============================
// Dashboard Statistics
// ==============================

exports.getDashboardStats = (req, res) => {

    const userId = req.user.id;

    const sql = `
    SELECT
        COUNT(DISTINCT r.id) AS resumes,
        COALESCE(MAX(ra.score),0) AS score,
        COALESCE(JSON_LENGTH(MAX(ra.foundSkills)),0) AS skills
    FROM resumes r
    LEFT JOIN resume_analysis ra
    ON r.id = ra.resume_id
    WHERE r.user_id = ?;
    `;

    db.query(sql, [userId], (err, stats) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        db.query(
            `
            SELECT h.score
            FROM resume_score_history h
            JOIN resumes r
            ON h.resume_id = r.id
            WHERE r.user_id = ?
            ORDER BY h.created_at ASC
            `,
            [userId],
            (err, history) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Database Error"
                    });
                }

                const historyScores = history.map(item => item.score);

                db.query(
                    `
                    SELECT
                        r.id,
                        r.original_name,
                        ra.score,
                        r.uploaded_at
                    FROM resumes r
                    LEFT JOIN resume_analysis ra
                    ON r.id = ra.resume_id
                    WHERE r.user_id = ?
                    ORDER BY r.uploaded_at DESC
                    LIMIT 5
                    `,
                    [userId],
                    (err, recent) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                success: false,
                                message: "Database Error"
                            });
                        }

                        return res.json({
                            resumes: stats[0].resumes,
                            score: stats[0].score,
                            skills: stats[0].skills,
                            history: historyScores,
                            recentResumes: recent.map(item => ({
                                id: item.id,
                                name: item.original_name,
                                score: item.score || 0,
                                date: new Date(item.uploaded_at).toLocaleString()
                            }))
                        });

                    }
                );

            }
        );

    });

};

// ============================
// Get Profile
// ============================

exports.getProfile = (req, res) => {

    db.query(
        `SELECT
            id,
            name,
            email,
            phone,
            college,
            course,
            graduation_year,
            github,
            linkedin,
            bio,
            profile_image
        FROM users
        WHERE id=?`,
        [req.user.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success:false,
                    message:"Database Error"
                });
            }

            res.json(result[0]);

        }
    );

};

// ============================
// Update Profile
// ============================

exports.updateProfile = (req,res)=>{

    const {
        name,
        phone,
        college,
        course,
        graduation_year,
        github,
        linkedin,
        bio
    } = req.body;

    db.query(

        `UPDATE users SET
        name=?,
        phone=?,
        college=?,
        course=?,
        graduation_year=?,
        github=?,
        linkedin=?,
        bio=?
        WHERE id=?`,

        [
            name,
            phone,
            college,
            course,
            graduation_year,
            github,
            linkedin,
            bio,
            req.user.id
        ],

        (err)=>{

            if(err){

                return res.status(500).json({
                    success:false,
                    message:"Database Error"
                });

            }

            res.json({
                success:true,
                message:"Profile Updated"
            });

        }

    );

};

exports.getCareerCoach = (req, res) => {
  // We'll implement the logic next.
};

// ==============================
// AI Career Coach
// ==============================

exports.getCareerCoach = (req, res) => {

    const userId = req.user.id;

    db.query(
        `
        SELECT ra.foundSkills
        FROM resume_analysis ra
        JOIN resumes r
        ON ra.resume_id = r.id
        WHERE r.user_id=?
        ORDER BY ra.created_at DESC
        LIMIT 1
        `,
        [userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success:false,
                    message:"Database Error"
                });
            }

            if(result.length===0){

                return res.json({
                    career:"No Resume Found",
                    nextSkills:[],
                    projects:[],
                    certifications:[]
                });

            }

            const skills = JSON.parse(result[0].foundSkills || "[]");

            let career = "Software Developer";

            let nextSkills = [];
            let projects = [];
            let certifications = [];

            if(skills.includes("Java")){

                career="Java Backend Developer";

                nextSkills=[
                    "Spring Boot",
                    "REST API",
                    "Docker",
                    "AWS"
                ];

                projects=[
                    "Hospital Management System",
                    "Banking Application",
                    "E-Commerce Backend"
                ];

                certifications=[
                    "Oracle Java",
                    "AWS Cloud Practitioner"
                ];

            }

            if(skills.includes("JavaScript")){

                career="Full Stack Developer";

                nextSkills=[
                    "React",
                    "Node.js",
                    "Express",
                    "MongoDB"
                ];

                projects=[
                    "Chat Application",
                    "Job Portal",
                    "Food Delivery App"
                ];

                certifications=[
                    "Meta React",
                    "MongoDB Associate"
                ];

            }

            res.json({

                career,

                currentSkills:skills,

                nextSkills,

                projects,

                certifications

            });

        }

    );

};