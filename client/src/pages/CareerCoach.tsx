import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/CareerCoach.css";

function CareerCoach() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {

    const loadData = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await api.get(
          "/resume/career-coach",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);

      } catch (err) {
        console.log(err);
      }

    };

    loadData();

  }, []);

  if (!data) {
    return <h2 style={{ color: "white", padding: 40 }}>Loading...</h2>;
  }

 return (
  <div className="career-page">

    <h1>🤖 AI Career Coach</h1>

    <div className="career-grid">

      <div className="career-card">
        <h2>🎯 Recommended Career</h2>
        <h3>{data.career}</h3>
      </div>

      <div className="career-card">
        <h2>💻 Current Skills</h2>
        {data.currentSkills.map((skill: string) => (
          <span className="tag" key={skill}>{skill}</span>
        ))}
      </div>

      <div className="career-card">
        <h2>📚 Skills To Learn</h2>
        {data.nextSkills.map((skill: string) => (
          <span className="tag blue" key={skill}>{skill}</span>
        ))}
      </div>

      <div className="career-card">
        <h2>💼 Recommended Projects</h2>
        <ul>
          {data.projects.map((p: string) => (
            <li key={p}>🚀 {p}</li>
          ))}
        </ul>
      </div>

      <div className="career-card">
        <h2>🏆 Certifications</h2>
        <ul>
          {data.certifications.map((c: string) => (
            <li key={c}>🏅 {c}</li>
          ))}
        </ul>
      </div>

      <div className="career-card">
        <h2>📅 30-Day Roadmap</h2>
        <ol>
          {data.roadmap.map((r: string) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </div>

    </div>

  </div>
);
}

export default CareerCoach;