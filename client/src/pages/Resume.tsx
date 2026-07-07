import { useState } from "react";
import api from "../services/api";
import "../styles/Resume.css";

function Resume() {
  const [file, setFile] = useState<File | null>(null);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);
    } catch (err: any) {
      console.log(err);
      alert("Upload failed");
    }
  };

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
      </div>
    </div>
  );
}

export default Resume;