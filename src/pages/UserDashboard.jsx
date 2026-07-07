import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SquaresFour,
  ClipboardText,
  ListBullets,
  Bell,
  User,
  SignOut,
  Clock,
  ArrowsClockwise,
  CheckCircle,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const headers = { "Authorization": `Bearer ${token}` };

          const [statsRes, complaintsRes] = await Promise.all([
            fetch("http://localhost:5000/api/user/stats", { headers }),
            fetch("http://localhost:5000/api/complaints", { headers }),
          ]);
          const statsData      = await statsRes.json();
          const complaintsData = await complaintsRes.json();
          setStats(statsData);
          setRecentComplaints(complaintsData.complaints.slice(0, 5));
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    }, []);

  const statConfig = [
    { label: "Pending",     count: stats.pending,    sub: "Awaiting review",  color: "#ff9800", Icon: Clock           },
    { label: "In Progress", count: stats.inProgress, sub: "Being resolved",   color: "#3f51b5", Icon: ArrowsClockwise },
    { label: "Resolved",    count: stats.resolved,   sub: "Successfully closed", color: "#4caf50", Icon: CheckCircle  },
  ];

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
            background: "#2471A3", display: "flex",
            alignItems: "center", justifyContent: "center",
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
                  setActiveNav(key);
                  if (key === "dashboard")  navigate("/user");
                  if (key === "submit")     navigate("/submit");
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
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px 40px" }}>

          {/* Page heading */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a2b45", margin: "0 0 4px" }}>
              Welcome back, {user.fullName || "Username"}! 
            </h1>
            <p style={{ fontSize: "14px", color: "#718096", margin: 0 }}>
              {user.location ? `${user.location}, Here's a summary of your complaints and activity` : "Here's a summary of your complaints and activity"}
            </p>
          </div>

          {/* Stats grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "28px",
          }}>
            {statConfig.map((stat, i) => (
              <div key={i} style={{
                background: "#ffffff",
                padding: "20px 24px",
                borderRadius: "18px",
                border: "1.5px solid #C5D9EE",
                boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#4A5568" }}>{stat.label}</div>
                    <div style={{ fontSize: "36px", fontWeight: "700", color: "#1a2b45", margin: "8px 0" }}>
                      {loading ? "..." : stat.count}
                    </div>
                    <div style={{ fontSize: "12px", color: "#718096" }}>{stat.sub}</div>
                  </div>
                  <stat.Icon size={22} color={stat.color} weight="fill" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick action cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            marginBottom: "28px",
          }}>
            {/* Submit complaint */}
            <div style={{
              background: "#ffffff", padding: "24px",
              borderRadius: "18px", border: "1.5px solid #C5D9EE",
              boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ margin: "0 0 6px", color: "#1a2b45", fontSize: "16px", fontWeight: "700" }}>
                  Submit New Complaint
                </h3>
                <PaperPlaneTilt size={20} color="#1D70B8" weight="fill" />
              </div>
              <p style={{ fontSize: "13px", color: "#718096", margin: "0 0 16px" }}>
                File a new complaint and get it resolved as soon as possible.
              </p>
              <button
                onClick={() => navigate("/submit")}
                style={{
                  width: "100%", padding: "11px", background: "#1D70B8",
                  color: "#fff", border: "none", borderRadius: "10px",
                  fontWeight: "600", fontSize: "14px", cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(29,112,184,0.3)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#155a94"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#1D70B8"}
              >
                Submit Complaint
              </button>
            </div>

            {/* View complaints */}
            <div style={{
              background: "#ffffff", padding: "24px",
              borderRadius: "18px", border: "1.5px solid #C5D9EE",
              boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ margin: "0 0 6px", color: "#1a2b45", fontSize: "16px", fontWeight: "700" }}>
                  View My Complaints
                </h3>
                <ListBullets size={20} color="#4caf50" weight="fill" />
              </div>
              <p style={{ fontSize: "13px", color: "#718096", margin: "0 0 16px" }}>
                Track the status of your submitted complaints and review updates.
              </p>
              <button
                onClick={() => navigate("/mycomplaints")}
                style={{
                  width: "100%", padding: "11px", background: "#fff",
                  color: "#1D70B8", border: "1.5px solid #1D70B8",
                  borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#E8F1FB"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
              >
                View Complaints
              </button>
            </div>
          </div>

          {/* Recent complaints table */}
          <div style={{
            background: "#ffffff",
            borderRadius: "18px",
            border: "1.5px solid #C5D9EE",
            boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}>
            {/* Table header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px 16px", borderBottom: "1px solid #E8F1FB",
            }}>
              <div>
                <h3 style={{ margin: "0 0 2px", color: "#1a2b45", fontSize: "18px", fontWeight: "700" }}>
                  Recent Complaints
                </h3>
                <p style={{ fontSize: "13px", color: "#718096", margin: 0 }}>
                  Your latest submitted complaints
                </p>
              </div>
              <button
                onClick={() => navigate("/mycomplaints")}
                style={{
                  background: "#F0F6FC", border: "1.5px solid #C5D9EE",
                  borderRadius: "8px", padding: "6px 16px",
                  fontSize: "13px", fontWeight: "600",
                  color: "#2471A3", cursor: "pointer",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#E8F1FB"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#F0F6FC"}
              >
                View All
              </button>
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: "#F7FAFD" }}>
                  {[
                    { label: "ID",       width: "12%" },
                    { label: "Title",    width: "28%" },
                    { label: "Category", width: "25%" },
                    { label: "Date",     width: "20%" },
                    { label: "Status",   width: "15%" },
                  ].map(({ label, width }) => (
                    <th key={label} style={{
                      padding: "12px 16px", textAlign: "center", width,
                      fontSize: "13px", fontWeight: "700", color: "#4A5568",
                      borderBottom: "1px solid #E8F1FB", letterSpacing: "0.02em",
                    }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#9BB8D0", fontSize: "14px" }}>
                      {loading ? "Loading..." : "No complaints yet. Submit your first complaint!"}
                    </td>
                  </tr>
                ) : (
                  recentComplaints.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{ background: i % 2 === 0 ? "#ffffff" : "#F9FBFD", transition: "background 0.12s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#EEF5FC"}
                      onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#ffffff" : "#F9FBFD"}
                    >
                      <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "700", color: "#1a2b45", borderBottom: "1px solid #F0F6FC" }}>{c.id}</td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", color: "#2d3748", borderBottom: "1px solid #F0F6FC" }}>{c.title}</td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", color: "#4A5568", borderBottom: "1px solid #F0F6FC" }}>{c.category}</td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", color: "#4A5568", borderBottom: "1px solid #F0F6FC" }}>{c.date}</td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F0F6FC" }}>
                        <span style={{
                          padding: "4px 12px", borderRadius: "20px",
                          fontSize: "12px", fontWeight: "700", display: "inline-block",
                          ...(c.status === "Pending"     ? { background: "#FEF08A", color: "#854D0E" } :
                              c.status === "Resolved"    ? { background: "#BBF7D0", color: "#166534" } :
                                                           { background: "#BAE6FD", color: "#075985" }),
                        }}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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