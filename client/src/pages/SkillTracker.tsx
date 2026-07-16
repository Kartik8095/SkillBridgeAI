import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/SkillTracker.css";

function SkillTracker() {

    const [skills, setSkills] = useState<any[]>([]);

    useEffect(() => {

        const load = async () => {

            const token = localStorage.getItem("token");

            const res = await api.get(
                "/resume/skill-tracker",
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );

            setSkills(res.data.skills);

        };

        load();

    }, []);

    return (

        <div className="tracker-page">

            <h1>📊 Skill Tracker</h1>

            {

                skills.map((skill,index)=>(

                    <div
                        className="skill-card"
                        key={index}
                    >

                        <div className="skill-head">

                            <span>{skill.name}</span>

                            <span>{skill.progress}%</span>

                        </div>

                        <progress
                            value={skill.progress}
                            max="100"
                        />

                    </div>

                ))

            }

        </div>

    );

}

export default SkillTracker;