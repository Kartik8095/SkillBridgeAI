import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import CareerCoach from "./pages/CareerCoach";
import Jobs from "./pages/Jobs";
import Interview from "./pages/Interview";
import Roadmap from "./pages/Roadmap";
import SkillTracker from "./pages/SkillTracker";
import MockInterview from "./pages/MockInterview";
import ResumeBuilder from "./pages/ResumeBuilder";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/profile"element={<Profile />}/>
        <Route path="/career" element={<CareerCoach />} />
        <Route path="/jobs"element={<Jobs />}/>
        <Route path="/interview"element={<Interview />}/>
        <Route
    path="/roadmap"
    element={<Roadmap />}
/>
<Route
    path="/skills"
    element={<SkillTracker />}
/>
<Route
    path="/mock-interview"
    element={<MockInterview />}
/>
     <Route
    path="/resume-builder"
    element={<ResumeBuilder />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;