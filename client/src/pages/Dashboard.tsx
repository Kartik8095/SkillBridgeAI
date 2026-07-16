import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Dashboard.css";

import ScoreChart from "../components/Dashboard/ScoreChart";
import Sidebar from "../components/Layout/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  const [stats, setStats] = useState({
    resumes: 0,
    score: 0,
    skills: 0,
  });

  const [recentResumes, setRecentResumes] = useState<any[]>([]);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Profile
        const profileRes = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(profileRes.data.user);

        // Dashboard
        const dashboardRes = await api.get("/resume/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats({
          resumes: dashboardRes.data.resumes,
          score: dashboardRes.data.score,
          skills: dashboardRes.data.skills,
        });

        setRecentResumes(dashboardRes.data.recentResumes || []);
        setHistory(dashboardRes.data.history || []);
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  return (
  <div className="dashboard">

    <Sidebar />

    <div className="main-content">

      <div className="container">

        <div className="welcome-card">
          <h1>👋 Welcome back!</h1>
          <p>{user?.name}</p>
          <p>{user?.email}</p>
        </div>

        <div className="cards">
          

          <div
            className="card"
            onClick={() => navigate("/resume")}
          >
            <h1>📄</h1>
            <h3>{stats.resumes}</h3>
            <p>Uploaded Resumes</p>
          </div>

          <div className="card">
            <h1>🤖</h1>
            <h3>{stats.score}%</h3>
            <p>Resume Score</p>
          </div>

          <div className="card">
            <h1>💻</h1>
            <h3>{stats.skills}</h3>
            <p>Skills Found</p>
          </div>

          <div className="card">
            <h1>🎯</h1>
            <h3>AI Ready</h3>
            <p>Career Suggestions</p>
          </div>

        </div>

        <div className="recent-section">

          <h2>📄 Recent Resume Activity</h2>

          {recentResumes.length === 0 ? (

            <p>No resumes uploaded yet.</p>

          ) : (

            recentResumes.map((resume) => (

              <div
                className="recent-card"
                key={resume.id}
              >
                <div>
                  <h3>{resume.name}</h3>
                  <p>{resume.date}</p>
                </div>

                <div className="recent-score">
                  {resume.score}%
                </div>

              </div>

            ))

          )}

        </div>

        <div
          className="card"
          onClick={() => navigate("/profile")}
          style={{ marginTop: "25px" }}
        >
          <h1>👤</h1>
          <h3>My Profile</h3>
          <p>View & Edit Profile</p>
        </div>

        <ScoreChart history={history} />

      </div>

    </div>

  </div>
);
}

export default Dashboard;