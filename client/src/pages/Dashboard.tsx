import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  return (
  <div
    style={{
      padding: "40px",
      background: "#f5f7fb",
      minHeight: "100vh",
      color: "#222",
    }}
  >
    <h1>🎉 Dashboard</h1>

    {user && (
      <>
        <h2>Welcome {user.email}</h2>
        <p>User ID: {user.id}</p>
      </>
    )}
  </div>
);
}

export default Dashboard;