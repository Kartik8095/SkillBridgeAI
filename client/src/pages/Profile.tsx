import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Profile.css";
import { toast } from "react-toastify";

function Profile() {

 const [user, setUser] = useState({
  name: "",
  email: "",
  phone: "",
  college: "",
  course: "",
  graduation_year: "",
  github: "",
  linkedin: "",
  bio: "",
  profile_image: "",
});

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(res.data.user);
  };

  const updateProfile = async () => {
    try {

      const res = await api.put(
        "/auth/update",
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

    } catch {
      toast.error("Update Failed");
    }
  };

  const changePassword = async () => {

    try {

      const res = await api.put(
        "/auth/change-password",
        password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      setPassword({
        currentPassword: "",
        newPassword: "",
      });

    } catch {

      toast.error("Password Change Failed");

    }

  };

  return (

    <div className="profile-page">

      <div className="profile-card">
        <div className="profile-avatar">

  {user.profile_image ? (

    <img
      src={`http://localhost:5000/uploads/${user.profile_image}`}
      alt=""
    />

  ) : (

    user.name
      ? user.name
          .split(" ")
          .map((n)=>n[0])
          .join("")
      : "U"

  )}

</div>
        <h1>👤 My Profile</h1>

        <input
          value={user.name}
          placeholder="Name"
          onChange={(e)=>
            setUser({...user,name:e.target.value})
          }
        />

        <input
          value={user.email}
          disabled
        />

        <input
          value={user.phone}
          placeholder="Phone"
          onChange={(e)=>
            setUser({...user,phone:e.target.value})
          }
        />

        <input
          value={user.college}
          placeholder="College"
          onChange={(e)=>
            setUser({...user,college:e.target.value})
          }
        />

        <input
          value={user.course}
          placeholder="Course"
          onChange={(e)=>
            setUser({...user,course:e.target.value})
          }
        />

        <input
          value={user.graduation_year}
          placeholder="Graduation Year"
          onChange={(e)=>
            setUser({...user,graduation_year:e.target.value})
          }
        />

        <input
  value={user.github}
  placeholder="GitHub URL"
  onChange={(e)=>
    setUser({...user,github:e.target.value})
  }
/>

<input
  value={user.linkedin}
  placeholder="LinkedIn URL"
  onChange={(e)=>
    setUser({...user,linkedin:e.target.value})
  }
/>

<textarea
  value={user.bio}
  placeholder="Tell us about yourself..."
  onChange={(e)=>
    setUser({...user,bio:e.target.value})
  }
/>

        <button onClick={updateProfile}>
          Save Profile
        </button>

        <hr />

        <h2>🔒 Change Password</h2>

        <input
          type="password"
          placeholder="Current Password"
          value={password.currentPassword}
          onChange={(e)=>
            setPassword({
              ...password,
              currentPassword:e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={password.newPassword}
          onChange={(e)=>
            setPassword({
              ...password,
              newPassword:e.target.value
            })
          }
        />

        <button onClick={changePassword}>
          Change Password
        </button>

      </div>

    </div>

  );

}

export default Profile;