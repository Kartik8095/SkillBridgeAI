import { useState } from "react";
import "../styles/ResumeBuilder.css";

function ResumeBuilder() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    skills: "",
    projects: "",
    experience: ""
  });

  return (

    <div className="builder-page">

      <div className="builder-form">

        <h1>📝 AI Resume Builder</h1>

        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e)=>setForm({...form,phone:e.target.value})}
        />

        <input
          placeholder="College"
          value={form.college}
          onChange={(e)=>setForm({...form,college:e.target.value})}
        />

        <input
          placeholder="Course"
          value={form.course}
          onChange={(e)=>setForm({...form,course:e.target.value})}
        />

        <textarea
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(e)=>setForm({...form,skills:e.target.value})}
        />

        <textarea
          placeholder="Projects"
          value={form.projects}
          onChange={(e)=>setForm({...form,projects:e.target.value})}
        />

        <textarea
          placeholder="Experience"
          value={form.experience}
          onChange={(e)=>setForm({...form,experience:e.target.value})}
        />

        <button>
          Generate Resume
        </button>

      </div>

      <div className="resume-preview">

        <h1>{form.name || "Your Name"}</h1>

        <p>{form.email}</p>

        <p>{form.phone}</p>

        <hr/>

        <h2>Education</h2>

        <p>{form.course}</p>

        <p>{form.college}</p>

        <h2>Skills</h2>

        <p>{form.skills}</p>

        <h2>Projects</h2>

        <p>{form.projects}</p>

        <h2>Experience</h2>

        <p>{form.experience}</p>

      </div>

    </div>

  );

}

export default ResumeBuilder;