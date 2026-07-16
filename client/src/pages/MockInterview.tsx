import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/MockInterview.css";

function MockInterview() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {

    const loadInterview = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await api.get(
          "/resume/mock-interview",
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

    loadInterview();

  }, []);

  if (!data) {
    return (
      <h2 style={{ color: "white", padding: "40px" }}>
        Loading Interview...
      </h2>
    );
  }

  return (

    <div className="mock-page">

      <h1>🎤 AI Mock Interview</h1>

      <h2>{data.role}</h2>

      {data.questions.map((q: string, index: number) => (

        <div
          className="question-card"
          key={index}
        >

          <h3>
            Question {index + 1}
          </h3>

          <p>{q}</p>

          <textarea
            placeholder="Type your answer here..."
          />

        </div>

      ))}

    </div>

  );

}

export default MockInterview;