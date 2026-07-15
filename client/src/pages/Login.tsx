import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../services/api";

import "../styles/Login.css";

import AnimatedBackground from "../components/UI/AnimatedBackground";
import MouseGlow from "../components/UI/MouseGlow";
import Logo from "../components/UI/Logo";
import AnimatedInput from "../components/UI/AnimatedInput";
import AnimatedButton from "../components/UI/AnimatedButton";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Please enter Email and Password");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      toast.success("Login Successful 🚀");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="login-page">

      <AnimatedBackground />

      <MouseGlow />

      <ToastContainer />

      <div className="login-content">

        <Logo />

       <div className="email-section">

<AnimatedInput
direction="left"
icon={<FaEnvelope />}
name="email"
type="email"
placeholder="Email Address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

</div>

<div className="password-section">

<AnimatedInput
direction="right"
icon={<FaLock />}
  name="password"
type={showPassword ? "text":"password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
rightIcon={
<span
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? <FaEyeSlash/> : <FaEye/>}
</span>
}
/>

</div>

<div className="button-section">

<AnimatedButton
text="Login"
onClick={handleLogin}
/>

</div>
        

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;