import { useNavigate } from "react-router-dom";

export default function Sidebar() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">

      <h2>🚀 SkillBridge AI</h2>

      <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>

      <button onClick={() => navigate("/resume")}>📄 Resume Center</button>

      <button onClick={() => navigate("/profile")}>👤 Profile</button>

      <button onClick={() => navigate("/career")}>🤖 AI Career Coach</button>

      <button onClick={() => navigate("/skills")}>📈 Skill Tracker</button>

      <button onClick={() => navigate("/jobs")}>💼 Jobs</button>

      <button onClick={() => navigate("/interview")}>🎯 Interview</button>

      <button onClick={() => navigate("/roadmap")}>📚 Roadmap</button>

      <button onClick={() => navigate("/settings")}>⚙ Settings</button>

      <button className="logout" onClick={logout}>
        🚪 Logout
      </button>

    </div>
  );
}