import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Dashboard.css";


function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        navigate("/");
      }
    };

    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">

      <div className="navbar">
        <h2>🚀 SkillBridge AI</h2>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="container">

        <div className="welcome-card">
          <h1>👋 Welcome {user?.email}</h1>
          <p>User ID : {user?.id}</p>
        </div>

        <div className="cards">

          <div
  className="card"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/resume")}
>
  <h1>📄</h1>
  <h3>Resume Upload</h3>
</div>

          <div className="card">
            <h1>🤖</h1>
            <h3>AI Analysis</h3>
          </div>

          <div className="card">
            <h1>💼</h1>
            <h3>Jobs</h3>
          </div>

          <div className="card">
            <h1>📈</h1>
            <h3>Skills</h3>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;