import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err: any) {
  console.log("ERROR:", err);
  console.log("RESPONSE:", err.response);

  alert(err.response?.data?.message || err.message);
}
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>SkillBridge AI</h1>
        <h2>Welcome Back 👋</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;