import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Resume.css";

function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [resumes, setResumes] = useState<any[]>([]);
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
      fetchResumes();
    } catch (err: any) {
      console.log(err);
      alert("Upload failed");
    }
  };
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

    // Refresh the list
    fetchResumes();
  } catch (err: any) {
    console.log(err);
    alert("Delete failed");
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

        <button onClick={uploadResume}>
          Upload Resume
        </button>
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
        padding: "10px",
        marginTop: "10px",
        borderRadius: "8px",
      }}
    >
      <p>
        <strong>{resume.original_name}</strong>
      </p>

      <small>
        Uploaded: {new Date(resume.uploaded_at).toLocaleString()}
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

      </div>
    </div>
  );
}

export default Resume;