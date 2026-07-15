const db = require("../config/db");

function query(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

async function saveAnalysis(resumeId, analysis, fileHash) {

  // Duplicate check
  const duplicate = await query(
    "SELECT * FROM resume_versions WHERE file_hash = ?",
    [fileHash]
  );

  if (duplicate.length > 0) {
    return {
      duplicate: true,
      version: duplicate[0].version,
    };
  }

  // Get next version
  const versionResult = await query(
    "SELECT COUNT(*) total FROM resume_versions WHERE resume_id=?",
    [resumeId]
  );

  const version = versionResult[0].total + 1;

  // Save version
  await query(
    `INSERT INTO resume_versions
    (resume_id,version,file_hash)
    VALUES(?,?,?)`,
    [
      resumeId,
      version,
      fileHash,
    ]
  );

  // Save analysis
  await query(
    `INSERT INTO resume_analysis
    (
      resume_id,
      name,
      email,
      phone,
      github,
      linkedin,
      education,
      projects,
      certifications,
      score,
      foundSkills,
      missingSkills,
      suggestions
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      resumeId,
      analysis.name,
      analysis.email,
      analysis.phone,
      analysis.github,
      analysis.linkedin,
      analysis.education,
      analysis.projects,
      analysis.certifications,
      analysis.score,
      JSON.stringify(analysis.foundSkills),
      JSON.stringify(analysis.missingSkills),
      JSON.stringify(analysis.suggestions),
    ]
  );

  // Save score history
  await query(
    `INSERT INTO resume_score_history
    (resume_id,score)
    VALUES(?,?)`,
    [
      resumeId,
      analysis.score,
    ]
  );

  return {
    duplicate: false,
    version,
  };

}

module.exports = saveAnalysis;