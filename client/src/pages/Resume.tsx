import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Resume.css";

function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Upload Resume
  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");

      const res = await api.post("/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);

      setFile(null);
      fetchResumes();
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  // Fetch Resumes
  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/resume/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResumes(res.data.resumes);
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Resume
  const deleteResume = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await api.delete(`/resume/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);

      fetchResumes();
      setAnalysis(null);
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // Analyze Resume
  const analyzeResume = async (filename: string) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get(`/resume/analyze/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalysis(res.data.analysis);
    } catch (err) {
      console.log(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="resume-container">
      <div className="resume-card">
        <h1>📄 Resume Upload</h1>

        <p>Upload your resume to get AI-powered analysis.</p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button onClick={uploadResume}>Upload Resume</button>

        <hr style={{ margin: "30px 0" }} />

        <h2>📂 My Uploaded Resumes</h2>

        {resumes.length === 0 ? (
          <p>No resumes uploaded yet.</p>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginTop: "15px",
              }}
            >
              <p>
                <strong>{resume.original_name}</strong>
              </p>

              <small>
                Uploaded:{" "}
                {new Date(resume.uploaded_at).toLocaleString()}
              </small>

              <br />
              <br />

              <a
                href={`http://localhost:5000/uploads/${resume.filename}`}
                target="_blank"
                rel="noreferrer"
              >
                <button style={{ marginRight: "10px" }}>
                  👁 View
                </button>
              </a>

              <button
                style={{
                  marginRight: "10px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => analyzeResume(resume.filename)}
              >
                🤖 Analyze
              </button>

              <button
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => deleteResume(resume.id)}
              >
                🗑 Delete
              </button>
            </div>
          ))
        )}

        <hr style={{ margin: "30px 0" }} />

       {loading && <p>🤖 Analyzing Resume...</p>}

{analysis && (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      marginTop: "20px",
      textAlign: "left",
    }}
  >
    <h2>🤖 AI Resume Analysis</h2>

    <h3>👤 Personal Information</h3>

    <p><strong>Name:</strong> {analysis.name}</p>

    <p><strong>Email:</strong> {analysis.email}</p>

    <p><strong>Phone:</strong> {analysis.phone}</p>

    <p>
      <strong>GitHub:</strong>{" "}
      {analysis.github !== "Not Found" ? (
        <a href={analysis.github} target="_blank" rel="noreferrer">
          {analysis.github}
        </a>
      ) : (
        "Not Found"
      )}
    </p>

    <p>
      <strong>LinkedIn:</strong>{" "}
      {analysis.linkedin !== "Not Found" ? (
        <a href={analysis.linkedin} target="_blank" rel="noreferrer">
          {analysis.linkedin}
        </a>
      ) : (
        "Not Found"
      )}
    </p>

    <hr />

    <h3>🎓 Education</h3>
    <p style={{ whiteSpace: "pre-wrap" }}>
      {analysis.education}
    </p>

    <hr />

    <h3>🚀 Projects</h3>
    <p style={{ whiteSpace: "pre-wrap" }}>
      {analysis.projects}
    </p>

    <hr />

    <h3>📜 Certifications</h3>
    <p style={{ whiteSpace: "pre-wrap" }}>
      {analysis.certifications}
    </p>

    <hr />

    <h3>📊 Resume Score: {analysis.score}/100</h3>

    <h3>✅ Skills Found</h3>
    <ul>
      {analysis.foundSkills.map((skill: string) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>

    <h3>⚠ Missing Skills</h3>

    {analysis.missingSkills.length === 0 ? (
      <p style={{ color: "green" }}>
        🎉 No missing skills found.
      </p>
    ) : (
      <ul>
        {analysis.missingSkills.map((skill: string) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    )}

    <h3>💡 Suggestions</h3>

    {analysis.suggestions.length === 0 ? (
      <p style={{ color: "green" }}>
        🎉 Excellent Resume! No suggestions.
      </p>
    ) : (
      <ul>
        {analysis.suggestions.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )}
  </div>
)}
      </div>
    </div>
  );
}

export default Resume;