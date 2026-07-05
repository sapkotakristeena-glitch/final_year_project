import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SquaresFour,
  Bell,
  User,
  SignOut,
  MagnifyingGlass,
  CaretDown,
} from "@phosphor-icons/react";

const STATUS_STYLES = {
  Pending:     { background: "#FEF08A", color: "#854D0E" },
  "In Review": { background: "#BAE6FD", color: "#075985" },
  Resolved:    { background: "#BBF7D0", color: "#166534" },
};

const STATUS_OPTIONS = ["Pending", "In Review", "Resolved"];

export default function Admin_Complaints() {
  const navigate                          = useNavigate();
  const [activeNav, setActiveNav]         = useState("complaints");
  const [complaints, setComplaints]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("All");
  const [updatingId, setUpdatingId]       = useState(null);
  const [showLogout, setShowLogout]       = useState(false);
  const [openDropdown, setOpenDropdown]   = useState(null);
  const user                              = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/complaints", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setComplaints(data.complaints);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (complaintId, newStatus) => {
    setUpdatingId(complaintId);
    setOpenDropdown(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setComplaints(prev =>
          prev.map(c => c.id === complaintId ? { ...c, status: newStatus } : c)
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toString().includes(search) ||
      (c.userName && c.userName.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw",
      position: "fixed", top: 0, left: 0,
      fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      background: "#DDE6F0", overflow: "hidden",
    }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{
        width: "230px", flexShrink: 0, background: "#F7F9FC",
        display: "flex", flexDirection: "column",
        padding: "24px 0 24px", borderRight: "1px solid #D8E4EF",
      }}>
        {/* Brand */}
        <div style={{ padding: "0 24px 28px" }}>
          <span
            onClick={() => navigate("/admin")}
            style={{ fontSize: "26px", fontWeight: "800", color: "#1D70B8", letterSpacing: "-0.5px", cursor: "pointer" }}
          >
            SolveIT
          </span>
        </div>

        {/* User chip */}
        <div style={{
          margin: "0 14px 28px", background: "#E8F1FB",
          borderRadius: "12px", padding: "10px 12px",
          display: "flex", alignItems: "center", gap: "10px",
          border: "1px solid #C5D9EE",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "#2471A3", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <User size={20} weight="fill" color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a365d" }}>@{user.fullName || "Admin"}</div>
            <div style={{ fontSize: "11px", color: "#718096" }}>Admin</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 12px" }}>
          {[
            { id: "dashboard",   label: "Dashboard",        Icon: SquaresFour },
            { id: "complaints",  label: "All Complaints",    Icon: MagnifyingGlass },
          ].map(({ id, label, Icon }) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveNav(id);
                  if (id === "dashboard") navigate("/admin");
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
          height: "60px", flexShrink: 0, background: "#F7F9FC",
          borderBottom: "1px solid #D8E4EF", display: "flex",
          alignItems: "center", justifyContent: "flex-end",
          padding: "0 28px", gap: "20px",
        }}>
          {[Bell, User].map((Icon, i) => (
            <button key={i} style={{ background: "none", border: "none", cursor: "pointer", color: "#2471A3", display: "flex", alignItems: "center" }}>
              <Icon size={22} weight="fill" />
            </button>
          ))}
          <button
            onClick={() => setShowLogout(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#2471A3", display: "flex", alignItems: "center" }}
          >
            <SignOut size={22} weight="fill" />
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px 40px" }}>

          {/* Page heading */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a2b45", margin: "0 0 4px" }}>
              All Complaints
            </h1>
            <p style={{ fontSize: "14px", color: "#718096", margin: 0 }}>
              View and manage all submitted complaints
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "#ffffff", borderRadius: "18px",
            border: "1.5px solid #C5D9EE",
            boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
            overflow: "visible",
          }}>
            {/* Card header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px 16px", borderBottom: "1px solid #E8F1FB",
            }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a2b45", margin: "0 0 2px" }}>
                  Complaint List
                </h2>
                <span style={{ fontSize: "13px", color: "#718096" }}>
                  Total: {complaints.length} Complaint(s)
                </span>
              </div>

              {/* Filter by status */}
              <div style={{ display: "flex", gap: "8px" }}>
                {["All", "Pending", "In Review", "Resolved"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    style={{
                      padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
                      fontWeight: "600", cursor: "pointer", border: "1.5px solid",
                      borderColor: filterStatus === s ? "#1D70B8" : "#C5D9EE",
                      background: filterStatus === s ? "#1D70B8" : "#fff",
                      color: filterStatus === s ? "#fff" : "#4A5568",
                      transition: "all 0.15s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #E8F1FB" }}>
              <div style={{ position: "relative", maxWidth: "320px" }}>
                <MagnifyingGlass
                  size={16} color="#9BB8D0"
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type="text"
                  placeholder="Search by title, category, user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%", height: "36px", paddingLeft: "36px", paddingRight: "12px",
                    border: "1.5px solid #C5D9EE", borderRadius: "9px",
                    background: "#F0F6FC", fontSize: "13px", color: "#2d3748",
                    outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2471A3"}
                  onBlur={(e) => e.target.style.borderColor = "#C5D9EE"}
                />
              </div>
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: "#F7FAFD" }}>
                  {[
                    { label: "ID",       width: "8%"  },
                    { label: "Title",    width: "22%" },
                    { label: "Category", width: "18%" },
                    { label: "Date",     width: "13%" },
                    { label: "User",     width: "16%" },
                    { label: "Status",   width: "15%" },
                    { label: "Actions",  width: "8%"  },
                  ].map(({ label, width }) => (
                    <th key={label} style={{
                      padding: "12px 12px", textAlign: "center", width,
                      fontSize: "13px", fontWeight: "700", color: "#4A5568",
                      borderBottom: "1px solid #E8F1FB", letterSpacing: "0.02em",
                    }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#9BB8D0", fontSize: "14px" }}>
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#9BB8D0", fontSize: "14px" }}>
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{ background: i % 2 === 0 ? "#ffffff" : "#F9FBFD", transition: "background 0.12s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#EEF5FC"}
                      onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#ffffff" : "#F9FBFD"}
                    >
                      <td style={{ padding: "14px 12px", fontSize: "14px", fontWeight: "700", textAlign: "center", color: "#1a2b45", borderBottom: "1px solid #F0F6FC" }}>
                        {c.id}
                      </td>
                      <td style={{ padding: "14px 12px", fontSize: "14px", textAlign: "center", color: "#2d3748", borderBottom: "1px solid #F0F6FC" }}>
                        {c.title}
                      </td>
                      <td style={{ padding: "14px 12px", fontSize: "14px", textAlign: "center", color: "#4A5568", borderBottom: "1px solid #F0F6FC" }}>
                        {c.category}
                      </td>
                      <td style={{ padding: "14px 12px", fontSize: "14px", textAlign: "center", color: "#4A5568", borderBottom: "1px solid #F0F6FC" }}>
                        {c.date}
                      </td>
                      <td style={{ padding: "14px 12px", fontSize: "14px", textAlign: "center", color: "#4A5568", borderBottom: "1px solid #F0F6FC" }}>
                        {c.userName || "—"}
                      </td>

                      {/* Status dropdown */}
                      <td style={{ padding: "14px 12px", textAlign: "center", borderBottom: "1px solid #F0F6FC" }}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <div
                            onClick={() => setOpenDropdown(openDropdown === c.id ? null : c.id)}
                            style={{
                              ...STATUS_STYLES[c.status],
                              padding: "4px 10px", borderRadius: "20px",
                              fontSize: "12px", fontWeight: "700",
                              display: "inline-flex", alignItems: "center", gap: "4px",
                              cursor: updatingId === c.id ? "wait" : "pointer",
                              opacity: updatingId === c.id ? 0.6 : 1,
                              userSelect: "none",
                            }}
                          >
                            {updatingId === c.id ? "Updating..." : c.status}
                            <CaretDown size={10} />
                          </div>

                          {openDropdown === c.id && (
                            <div style={{
                              position: "absolute", top: "110%", left: "50%",
                              transform: "translateX(-50%)",
                              background: "#fff", borderRadius: "10px",
                              border: "1.5px solid #C5D9EE",
                              boxShadow: "4px 4px 16px rgba(0,0,0,0.10)",
                              zIndex: 300, overflow: "hidden", minWidth: "130px",
                            }}>
                              {STATUS_OPTIONS.map((s) => (
                                <div
                                  key={s}
                                  onClick={() => updateStatus(c.id, s)}
                                  style={{
                                    padding: "9px 14px", fontSize: "13px",
                                    color: c.status === s ? "#2471A3" : "#2d3a52",
                                    background: c.status === s ? "#E8F1FB" : "#fff",
                                    cursor: "pointer", fontWeight: c.status === s ? 700 : 400,
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "#F0F6FC"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = c.status === s ? "#E8F1FB" : "#fff"}
                                >
                                  {s}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 12px", textAlign: "center", borderBottom: "1px solid #F0F6FC" }}>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === c.id ? null : c.id)}
                          style={{
                            background: "none", border: "1px solid #C5D9EE",
                            borderRadius: "7px", padding: "5px 10px",
                            fontSize: "12px", color: "#2471A3", fontWeight: "600",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#E8F1FB"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                        >
                          Edit
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

      {/* ── Logout modal ─────────────────────────────────────── */}
      {showLogout && (
        <div
          onClick={() => setShowLogout(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: "18px", border: "1.5px solid #C5D9EE",
              boxShadow: "4px 4px 24px rgba(0,0,0,0.12)",
              padding: "32px 36px", width: "400px", maxWidth: "90vw", textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a2b45", margin: "0 0 10px" }}>Log Out</h2>
            <p style={{ fontSize: "14px", color: "#718096", margin: "0 0 28px" }}>Are you sure you want to log out?</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowLogout(false)}
                style={{
                  flex: 1, padding: "11px", background: "#fff", color: "#2d3a52",
                  border: "1.5px solid #C5D9EE", borderRadius: "10px",
                  fontSize: "14px", fontWeight: "500", cursor: "pointer",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#F0F6FC"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
              >
                Cancel
              </button>
              <button
                onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); }}
                style={{
                  flex: 1, padding: "11px", background: "#E53E3E", color: "#fff",
                  border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
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