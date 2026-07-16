import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Interview.css";

function Interview() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {

    const loadQuestions = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await api.get(
          "/resume/interview",
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

    loadQuestions();

  }, []);

  if (!data) {

    return (
      <h2 style={{ color: "white", padding: 30 }}>
        Loading Interview Questions...
      </h2>
    );

  }

  return (

    <div className="interview-page">

      <h1>🎯 AI Interview Preparation</h1>

      <div className="interview-grid">

        <div className="interview-card">

          <h2>💻 Technical Questions</h2>

          <ul>

            {data.technical.map((q: string, index: number) => (

              <li key={index}>{q}</li>

            ))}

          </ul>

        </div>

        <div className="interview-card">

          <h2>🧑 HR Questions</h2>

          <ul>

            {data.hr.map((q: string, index: number) => (

              <li key={index}>{q}</li>

            ))}

          </ul>

        </div>

        <div className="interview-card">

          <h2>🧠 Coding Questions</h2>

          <ul>

            {data.coding.map((q: string, index: number) => (

              <li key={index}>{q}</li>

            ))}

          </ul>

        </div>

      </div>

    </div>

  );

}

export default Interview;