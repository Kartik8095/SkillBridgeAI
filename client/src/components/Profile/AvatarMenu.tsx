import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

interface Props {
  user: any;
}

export default function AvatarMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="avatar-menu" ref={menuRef}>
      <div
        className="avatar-circle"
        onClick={() => setOpen(!open)}
      >
        {user?.profile_image ? (
          <img
            src={`http://localhost:5000/uploads/${user.profile_image}`}
            alt=""
          />
        ) : (
          initials
        )}
      </div>

      {open &&
  createPortal(
    <div
      className="dropdown"
      style={{
        position: "fixed",
        top: "80px",
        right: "25px",
        zIndex: 999999,
      }}
    >
      <div className="dropdown-header">

        <div className="avatar-large">
          {user?.profile_image ? (
            <img
              src={`http://localhost:5000/uploads/${user.profile_image}`}
              alt=""
            />
          ) : (
            initials
          )}
        </div>

        <h3>{user?.name}</h3>
        <p>{user?.email}</p>

      </div>

      <hr />

      <button onClick={() => navigate("/profile")}>
        👤 My Profile
      </button>

      <button onClick={() => navigate("/resume")}>
        📄 Resume Center
      </button>

      <button onClick={() => navigate("/career")}>
        🤖 Career Coach
      </button>

      <button onClick={() => navigate("/settings")}>
        ⚙️ Settings
      </button>

      <button
        className="logout"
        onClick={logout}
      >
        🚪 Logout
      </button>

    </div>,
    document.body
  )}
    </div>
  );
}