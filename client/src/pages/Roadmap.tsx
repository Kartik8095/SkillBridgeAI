import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Roadmap.css";

function Roadmap() {

  const [roadmap, setRoadmap] = useState<string[]>([]);

  useEffect(() => {

    const loadRoadmap = async () => {

      const token = localStorage.getItem("token");

      const res = await api.get(
        "/resume/roadmap",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setRoadmap(res.data.roadmap);

    };

    loadRoadmap();

  }, []);

  return (

    <div className="roadmap-page">

      <h1>📚 AI Learning Roadmap</h1>

      {
        roadmap.map((item,index)=>(

          <div
            className="roadmap-card"
            key={index}
          >

            <h2>{item}</h2>

            <progress
              value="0"
              max="100"
            />

            <p>Progress : 0%</p>

          </div>

        ))
      }

    </div>

  );

}

export default Roadmap;