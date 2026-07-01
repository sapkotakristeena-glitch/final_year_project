import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SquaresFour,
  ClipboardText,
  ListBullets,
  Bell,
  User,
  SignOut,
} from "@phosphor-icons/react";

const accent = "#1a56c4";

export default function Complaint_Submission() {
  const [activeNav, setActiveNav] = useState("submit");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [showLogout, setShowLogout] = useState(false);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Complaint title is required";
    if (!description.trim()) e.description = "Description is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    setApiError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title:       title.trim(),
          description: description.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setApiError(data.error || "Failed to submit complaint.");
        return;
      }
      navigate("/mycomplaints");
    } catch (err) {
      setApiError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setErrors({});
  };

  const navItems = [
    { key: "dashboard",  label: "Dashboard",        Icon: SquaresFour  },
    { key: "submit",     label: "Submit Complaint",  Icon: ClipboardText },
    { key: "complaints", label: "My Complaints",     Icon: ListBullets  },
  ];

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0,
      fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      background: "#DDE6F0",
      overflow: "hidden",
    }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{
        width: "230px",
        flexShrink: 0,
        background: "#F7F9FC",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0 24px",
        borderRight: "1px solid #D8E4EF",
      }}>

        {/* Brand */}
        <div style={{ padding: "0 24px 28px" }}>
          <span style={{ fontSize: "26px", fontWeight: "800", color: "#1D70B8", letterSpacing: "-0.5px" }}>
            SolveIT
          </span>
        </div>

        {/* User chip */}
        <div style={{
          margin: "0 14px 28px",
          background: "#E8F1FB",
          borderRadius: "12px",
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid #C5D9EE",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "#2471A3", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <User size={20} weight="fill" color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a365d" }}>@{user.fullName || "Username"}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 12px" }}>
          {navItems.map(({ key, label, Icon }) => {
            const active = activeNav === key;
            return (
              <button
                key={key}
                onClick={() => {
                  if (key === "dashboard") navigate("/user");
                  if (key === "submit") navigate("/submit");
                  if (key === "complaints") navigate("/mycomplaints");
                }}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 14px", borderRadius: "10px", border: "none",
                  background: active ? "#1D70B8" : "transparent",
                  color: active ? "#ffffff" : "#4A5568",
                  fontWeight: active ? "600" : "500",
                  fontSize: "14px", cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                  textAlign: "left", width: "100%",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#E8F1FB"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={18} weight={active ? "fill" : "regular"} />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main area ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <header style={{
          height: "60px",
          flexShrink: 0,
          background: "#F7F9FC",
          borderBottom: "1px solid #D8E4EF",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 28px",
          gap: "20px",
        }}>
          {[Bell, User].map((Icon, i) => (
            <button key={i} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#2471A3", display: "flex", alignItems: "center",
            }}>
              <Icon size={22} weight="fill" />
            </button>
          ))}
          <button
            onClick={() => setShowLogout(true)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#2471A3", display: "flex", alignItems: "center",
            }}
          >
            <SignOut size={22} weight="fill" />
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px 40px", display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "#fff",
            borderRadius: "18px",
            border: "1.5px solid #C5D9EE",
            boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
            padding: "32px 36px",
            width: "100%",
            maxWidth: 680,
            height: "fit-content",
          }}>

            {/* Page heading */}
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a2b45", margin: "0 0 4px" }}>
                Submit Complaint
              </h1>
              <p style={{ fontSize: "14px", color: "#718096", margin: 0 }}>
                Fill in the form below to submit a new complaint
              </p>
            </div>

            {/* Complaint Title */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2d3a52", marginBottom: "7px" }}>
                Complaint Title <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                placeholder="Brief description of your complaint"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors(er => ({ ...er, title: "" })); }}
                style={{
                  width: "100%", padding: "10px 14px",
                  border: `1.5px solid ${errors.title ? "#e53e3e" : accent}`,
                  borderRadius: "6px", fontSize: "13px", color: "#1a1a2e",
                  outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box", background: "#fff",
                }}
              />
              {errors.title && <div style={{ fontSize: "11px", color: "#e53e3e", marginTop: "4px" }}>{errors.title}</div>}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2d3a52", marginBottom: "7px" }}>
                Description <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <textarea
                placeholder="Provide detailed information about your complaint"
                value={description}
                onChange={(e) => { setDescription(e.target.value); setErrors(er => ({ ...er, description: "" })); }}
                style={{
                  width: "100%", padding: "10px 14px",
                  border: `1.5px solid ${errors.description ? "#e53e3e" : accent}`,
                  borderRadius: "6px", fontSize: "13px", color: "#1a1a2e",
                  outline: "none", fontFamily: "inherit",
                  resize: "vertical", minHeight: "120px",
                  boxSizing: "border-box", background: "#fff",
                }}
              />
              {errors.description && <div style={{ fontSize: "11px", color: "#e53e3e", marginTop: "4px" }}>{errors.description}</div>}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "28px" }}>
              {apiError && (
                <div style={{ fontSize: "13px", color: "#e53e3e", textAlign: "center" }}>
                  {apiError}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "260px", padding: "12px 0", background: "#1D70B8",
                  color: "#fff", border: "none", borderRadius: "10px",
                  fontSize: "14px", fontWeight: "600", cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(29,112,184,0.3)",
                  transition: "background 0.15s",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#155a94"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#1D70B8"}
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
              <button
                onClick={handleReset}
                style={{
                  width: "260px", padding: "11px 0", background: "#fff",
                  color: "#2d3a52", border: "1.5px solid #C5D9EE",
                  borderRadius: "10px", fontSize: "14px", fontWeight: "500", cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
      {/* ── Logout confirmation modal ─────────────── */}
      {showLogout && (
        <div
          onClick={() => setShowLogout(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: "18px",
              border: "1.5px solid #C5D9EE",
              boxShadow: "4px 4px 24px rgba(0,0,0,0.12)",
              padding: "32px 36px", width: "400px", maxWidth: "90vw",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a2b45", margin: "0 0 10px" }}>
              Log Out
            </h2>
            <p style={{ fontSize: "14px", color: "#718096", margin: "0 0 28px" }}>
              Are you sure you want to log out?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowLogout(false)}
                style={{
                  flex: 1, padding: "11px", background: "#fff",
                  color: "#2d3a52", border: "1.5px solid #C5D9EE",
                  borderRadius: "10px", fontSize: "14px", fontWeight: "500", cursor: "pointer",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#F0F6FC"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/");
                }}
                style={{
                  flex: 1, padding: "11px", background: "#E53E3E",
                  color: "#fff", border: "none",
                  borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#c53030"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#E53E3E"}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}