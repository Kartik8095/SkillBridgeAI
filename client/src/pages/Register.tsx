import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaBook,
  FaCalendarAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/Register.css";

import AnimatedBackground from "../components/UI/AnimatedBackground";
import MouseGlow from "../components/UI/MouseGlow";
import Logo from "../components/UI/Logo";
import AnimatedInput from "../components/UI/AnimatedInput";
import AnimatedButton from "../components/UI/AnimatedButton";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    graduationYear: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.college.trim() ||
      !formData.course.trim() ||
      !formData.graduationYear.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.warning("Please fill all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        course: formData.course,
        graduationYear: formData.graduationYear,
        password: formData.password,
      });

      toast.success(res.data.message);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        college: "",
        course: "",
        graduationYear: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <AnimatedBackground />

      <MouseGlow />

      <ToastContainer position="top-right" autoClose={2500} />

      <div className="register-content">

        <Logo />

        <div className="register-grid">

          <AnimatedInput
            name="fullName"
            direction="left"
            icon={<FaUser />}
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <AnimatedInput
            name="email"
            direction="right"
            icon={<FaEnvelope />}
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <AnimatedInput
            name="phone"
            direction="left"
            icon={<FaPhone />}
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <AnimatedInput
            name="college"
            direction="right"
            icon={<FaUniversity />}
            type="text"
            placeholder="College / University"
            value={formData.college}
            onChange={handleChange}
          />

          <AnimatedInput
            name="course"
            direction="left"
            icon={<FaBook />}
            type="text"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
          />

          <AnimatedInput
            name="graduationYear"
            direction="right"
            icon={<FaCalendarAlt />}
            type="text"
            placeholder="Graduation Year"
            value={formData.graduationYear}
            onChange={handleChange}
          />

          <AnimatedInput
            name="password"
            direction="left"
            icon={<FaLock />}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            rightIcon={
              <span
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={{ cursor: "pointer" }}
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            }
          />

          <AnimatedInput
            name="confirmPassword"
            direction="right"
            icon={<FaLock />}
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            rightIcon={
              <span
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                style={{ cursor: "pointer" }}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            }
          />

        </div>

        <div className="register-button-section">
          <AnimatedButton
            text={
              loading
                ? "Creating Account..."
                : "Create Account"
            }
            onClick={registerUser}
            disabled={loading}
          />
        </div>

        <p className="register-link">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;