import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SquaresFour,
  ClipboardText,
  ListBullets,
  Bell,
  User,
  SignOut,
  MagnifyingGlass,
  Eye,
  Plus,
} from "@phosphor-icons/react";

const STATUS_STYLES = {
  Pending: { background: "#FEF08A", color: "#854D0E" },
  Resolved: { background: "#BBF7D0", color: "#166534" },
  "In Review": { background: "#BAE6FD", color: "#075985" },
};

export default function MyComplaints() {
  const [search, setSearch]                       = useState("");
  const [activeNav, setActiveNav]                 = useState("complaints");
  const [complaints, setComplaints]               = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/complaints", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setComplaints(data.complaints);
        }
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filtered = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { key: "dashboard", label: "Dashboard", Icon: SquaresFour },
    { key: "submit", label: "Submit Complaint", Icon: ClipboardText },
    { key: "complaints", label: "My Complaints", Icon: ListBullets },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        position: "fixed",
        background: "#DDE6F0",
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        style={{
          width: "230px",
          flexShrink: 0,
          background: "#F7F9FC",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0 24px",
          borderRight: "1px solid #D8E4EF",
        }}
      >
        {/* Brand */}
        <div style={{ padding: "0 24px 28px" }}>
          <span
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#1D70B8",
              letterSpacing: "-0.5px",
            }}
          >
            SolveIT
          </span>
        </div>

        {/* User chip */}
        <div
          style={{
            margin: "0 14px 28px",
            background: "#E8F1FB",
            borderRadius: "12px",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #C5D9EE",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#2471A3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={20} weight="fill" color="#fff" />
          </div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a365d" }}>@{user.fullName || "Username"}</div>
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background: active ? "#1D70B8" : "transparent",
                  color: active ? "#ffffff" : "#4A5568",
                  fontWeight: active ? "600" : "500",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#E8F1FB";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
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
        {/* Top bar */}
        <header
          style={{
            height: "60px",
            flexShrink: 0,
            background: "#F7F9FC",
            borderBottom: "1px solid #D8E4EF",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 28px",
            gap: "20px",
          }}
        >
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
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px 40px" }}>
          {/* Page heading */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a2b45", margin: "0 0 4px" }}>
              My Complaints
            </h1>
            <p style={{ fontSize: "14px", color: "#718096", margin: 0 }}>
              View and track all your submitted complaints
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              border: "1.5px solid #C5D9EE",
              boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
              overflow: "hidden",
            }}
          >
            {/* Card header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px 16px",
                borderBottom: "1px solid #E8F1FB",
              }}
            >
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a2b45", margin: "0 0 2px" }}>
                  Complaint List
                </h2>
                <span style={{ fontSize: "13px", color: "#718096" }}>
                  Total: {complaints.length} Complaint(s)
                </span>
              </div>
              <button
                onClick={() => navigate("/submit")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  background: "#1D70B8",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 18px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(29,112,184,0.3)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#155a94")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1D70B8")}
              >
                <Plus size={16} weight="bold" />
                Submit New Complaint
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #E8F1FB" }}>
              <div style={{ position: "relative", maxWidth: "320px" }}>
                <MagnifyingGlass
                  size={16}
                  color="#9BB8D0"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search Complaints..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    height: "36px",
                    paddingLeft: "36px",
                    paddingRight: "12px",
                    border: "1.5px solid #C5D9EE",
                    borderRadius: "9px",
                    background: "#F0F6FC",
                    fontSize: "13px",
                    color: "#2d3748",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2471A3")}
                  onBlur={(e) => (e.target.style.borderColor = "#C5D9EE")}
                />
              </div>
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: "#F7FAFD" }}>
                  {[
                    { label: "ID",       width: "10%" },
                    { label: "Date",     width: "15%" },
                    { label: "Title",    width: "25%" },
                    { label: "Category", width: "20%" },
                    { label: "Status",   width: "15%" },
                    { label: "Actions",  width: "15%" },
                  ].map(({ label, width }) => (
                    <th key={label} style={{
                      padding: "12px 12px", textAlign: "center",
                      fontSize: "13px", fontWeight: "700", color: "#4A5568",
                      borderBottom: "1px solid #E8F1FB",
                      letterSpacing: "0.02em",
                      width: width,
                    }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "36px",
                        textAlign: "center",
                        color: "#9BB8D0",
                        fontSize: "14px",
                      }}
                    >
                      {loading ? "Loading..." : "No complaints found."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{
                        background: i % 2 === 0 ? "#ffffff" : "#F9FBFD",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#EEF5FC")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = i % 2 === 0 ? "#ffffff" : "#F9FBFD")
                      }
                    >
                        <td style={{ width: "10%", padding: "14px 12px", fontSize: "14px", textAlign: "center", fontWeight: "700", color: "#1a2b45", borderBottom: "1px solid #F0F6FC" }}>
                          {c.id}
                        </td>
                        <td style={{ width: "15%", padding: "14px 12px", fontSize: "14px", textAlign: "center", color: "#4A5568", borderBottom: "1px solid #F0F6FC" }}>
                          {c.date}
                        </td>
                        <td style={{ width: "25%", padding: "14px 12px", fontSize: "14px", textAlign: "center", color: "#2d3748", borderBottom: "1px solid #F0F6FC" }}>
                          {c.title}
                        </td>
                        <td style={{ width: "20%", padding: "14px 12px", fontSize: "14px", textAlign: "center", color: "#4A5568", borderBottom: "1px solid #F0F6FC" }}>
                          {c.category}
                        </td>
                        <td style={{ width: "15%", padding: "14px 12px", textAlign: "center", borderBottom: "1px solid #F0F6FC" }}>
                          <span style={{
                            ...STATUS_STYLES[c.status],
                            padding: "4px 12px", borderRadius: "20px",
                            fontSize: "12px", fontWeight: "700",
                            display: "inline-block",
                          }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ width: "15%", padding: "14px 12px", borderBottom: "1px solid #F0F6FC" }}>
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: "5px",
                              background: "none", border: "1px solid #C5D9EE",
                              borderRadius: "7px", padding: "5px 12px",
                              fontSize: "13px", color: "#2471A3", fontWeight: "600",
                              cursor: "pointer", transition: "background 0.12s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#E8F1FB"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                          >
                            <Eye size={14} weight="regular" />
                            View
                          </button>
                        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      {/* ── Modal ───────────────────────────────────────── */}
      {selectedComplaint && (
        <div
          onClick={() => setSelectedComplaint(null)}
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
              padding: "32px 36px", width: "480px", maxWidth: "90vw",
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a2b45", margin: 0 }}>
                Complaint Details
              </h2>
              <button
                onClick={() => setSelectedComplaint(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#718096", fontSize: "20px" }}
              >
                ✕
              </button>
            </div>

            {/* Fields */}
            {[
              { label: "Complaint ID", value: "C" + selectedComplaint.id },
              { label: "Date Filed",   value: selectedComplaint.date },
              { label: "Title",        value: selectedComplaint.title },
              { label: "Category",     value: selectedComplaint.category },
              { label: "Description",  value: selectedComplaint.description },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#718096", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {label}
                </div>
                <div style={{ fontSize: "14px", color: "#1a2b45", fontWeight: "500" }}>
                  {value}
                </div>
              </div>
            ))}

            {/* Status */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#718096", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Status
              </div>
              <span style={{
                ...STATUS_STYLES[selectedComplaint.status],
                padding: "4px 12px", borderRadius: "20px",
                fontSize: "12px", fontWeight: "700", display: "inline-block",
              }}>
                {selectedComplaint.status}
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedComplaint(null)}
              style={{
                width: "100%", padding: "11px", background: "#1D70B8",
                color: "#fff", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(29,112,184,0.3)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#155a94"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#1D70B8"}
            >
              Close
            </button>
          </div>
        </div>
      )}

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