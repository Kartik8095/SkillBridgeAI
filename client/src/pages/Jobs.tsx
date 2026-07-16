import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Jobs.css";

function Jobs() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {

    const loadJobs = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await api.get(
          "/resume/jobs",
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

    loadJobs();

  }, []);

  if (!data) {
    return <h2 style={{ color: "white", padding: 30 }}>Loading Jobs...</h2>;
  }

  return (
    <div className="jobs-page">

      <h1>💼 Recommended Jobs</h1>

      <h2>Career Path: {data.career}</h2>

      <div className="jobs-grid">

        {data.jobs.map((job: any, index: number) => (

          <div className="job-card" key={index}>

            <h3>{job.title}</h3>

            <p><strong>🏢 Company:</strong> {job.company}</p>

            <p><strong>📍 Location:</strong> {job.location}</p>

            <p><strong>💰 Salary:</strong> {job.salary}</p>

            <button>Apply</button>

          </div>

        ))}

      </div>

    </div>
  );

}

export default Jobs;