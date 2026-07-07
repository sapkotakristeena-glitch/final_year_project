import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SquaresFour,
  FileText,
  Bell,
  User,
  SignOut,
} from "@phosphor-icons/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell,
  Tooltip as RechartsTooltip,
} from "recharts";

const STATUS_COLORS   = { Pending: "#FBBF24", "In Review": "#60A5FA", Resolved: "#34D399" };
const CATEGORY_COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444"];

export default function Admin_Reports() {
  const navigate                    = useNavigate();
  const [activeNav, setActiveNav]   = useState("reports");
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const user                        = JSON.parse(localStorage.getItem("user")) || {};

  const [data, setData] = useState({
    byStatus:           [],
    byCategory:         [],
    perDay:             [],
    avgResolutionHours: 0,
    resolutionRate:     0,
    timeline:           [],
    byLocation:         [],
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token    = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/reports", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok) {
          setError(result.error || "Failed to load reports.");
          return;
        }
        setData(result);
      } catch (err) {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const navItems = [
    { id: "dashboard",  label: "Dashboard",      Icon: SquaresFour },
    { id: "complaints", label: "All Complaints",  Icon: FileText    },
    { id: "reports",    label: "Reports",         Icon: FileText    },
  ];

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
        <div style={{ padding: "0 24px 28px" }}>
          <span
            onClick={() => navigate("/admin")}
            style={{ fontSize: "26px", fontWeight: "800", color: "#1D70B8", letterSpacing: "-0.5px", cursor: "pointer" }}
          >
            SolveIT
          </span>
        </div>

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

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 12px" }}>
          {navItems.map(({ id, label, Icon }) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveNav(id);
                  if (id === "dashboard")  navigate("/admin");
                  if (id === "complaints") navigate("/admin/complaints");
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
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a2b45", margin: "0 0 4px" }}>
              Reports & Analytics
            </h1>
            <p style={{ fontSize: "14px", color: "#718096", margin: 0 }}>
              Visual overview of complaint trends and performance metrics
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "#9BB8D0", fontSize: "14px", marginTop: "60px" }}>
              Loading reports...
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", color: "#E53E3E", fontSize: "14px", marginTop: "60px" }}>
              {error}
            </div>
          ) : (
            <>
              {/* ── Summary cards ─────────────────────── */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px", marginBottom: "28px",
              }}>
                {[
                  { label: "Total Complaints",    value: data.byStatus.reduce((s, r) => s + r.count, 0) },
                  { label: "Resolution Rate",     value: `${data.resolutionRate}%` },
                  { label: "Avg Resolution Time", value: `${Math.round(data.avgResolutionHours)}h` },
                  { label: "Categories",          value: data.byCategory.length },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "#fff", padding: "20px 24px", borderRadius: "18px",
                    border: "1.5px solid #C5D9EE", boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
                  }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#4A5568", marginBottom: "8px" }}>{s.label}</div>
                    <div style={{ fontSize: "32px", fontWeight: "700", color: "#1a2b45" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* ── Row 1: Bar chart + Pie chart ──────── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

                {/* Bar chart — complaints by status */}
                <div style={{
                  background: "#fff", padding: "24px", borderRadius: "18px",
                  border: "1.5px solid #C5D9EE", boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
                }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#1a2b45" }}>
                    Complaints by Status
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.byStatus} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FB" />
                      <XAxis dataKey="status" tick={{ fontSize: 12, fill: "#4A5568" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#4A5568" }} />
                      <Tooltip
                        contentStyle={{ borderRadius: "10px", border: "1px solid #C5D9EE", fontSize: "13px" }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {data.byStatus.map((entry, index) => (
                          <Cell key={index} fill={STATUS_COLORS[entry.status] || "#3B82F6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie chart — complaints by category */}
                <div style={{
                  background: "#fff", padding: "24px", borderRadius: "18px",
                  border: "1.5px solid #C5D9EE", boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
                }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#1a2b45" }}>
                    Complaints by Category
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={data.byCategory}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {data.byCategory.map((entry, index) => (
                          <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "10px", border: "1px solid #C5D9EE", fontSize: "13px" }}
                        formatter={(value, name) => [value, name]}
                      />
                      <Legend
                        formatter={(value) => <span style={{ fontSize: "12px", color: "#4A5568" }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── Row 2: Line chart ─────────────────── */}
              <div style={{
                background: "#fff", padding: "24px", borderRadius: "18px",
                border: "1.5px solid #C5D9EE", boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
                marginBottom: "20px",
              }}>
                <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#1a2b45" }}>
                  Complaints Filed Per Day (Last 30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.perDay} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FB" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#4A5568" }}
                      tickFormatter={(d) => d.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#4A5568" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: "10px", border: "1px solid #C5D9EE", fontSize: "13px" }}
                      labelFormatter={(d) => `Date: ${d}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#1D70B8"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#1D70B8" }}
                      activeDot={{ r: 6 }}
                      name="Complaints"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* ── Row 4: Complaints per location ───── */}
              <div style={{
                background: "#fff", padding: "24px", borderRadius: "18px",
                border: "1.5px solid #C5D9EE", boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
                marginTop: "20px",
              }}>
                <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#1a2b45" }}>
                  Complaints by Location
                </h3>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart
                    data={data.byLocation}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 180, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FB" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "#4A5568" }} />
                    <YAxis
                      type="category"
                      dataKey="location"
                      tick={{ fontSize: 11, fill: "#4A5568" }}
                      width={175}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "10px", border: "1px solid #C5D9EE", fontSize: "13px" }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#1D70B8" name="Complaints" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ── Row 3: Status change timeline table ─ */}
              <div style={{
                background: "#fff", borderRadius: "18px",
                border: "1.5px solid #C5D9EE", boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}>
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E8F1FB" }}>
                  <h3 style={{ margin: "0 0 2px", fontSize: "18px", fontWeight: "700", color: "#1a2b45" }}>
                    Status Change Timeline
                  </h3>
                  <p style={{ fontSize: "13px", color: "#718096", margin: 0 }}>
                    Time interval between each status change per complaint
                  </p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <thead>
                    <tr style={{ background: "#F7FAFD" }}>
                      {[
                        { label: "Complaint",   width: "15%" },
                        { label: "Title",       width: "25%" },
                        { label: "From",        width: "15%" },
                        { label: "To",          width: "15%" },
                        { label: "Changed At",  width: "18%" },
                        { label: "Time in Prev Status", width: "12%" },
                      ].map(({ label, width }) => (
                        <th key={label} style={{
                          padding: "12px 16px", textAlign: "center", width,
                          fontSize: "13px", fontWeight: "700", color: "#4A5568",
                          borderBottom: "1px solid #E8F1FB",
                        }}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.timeline.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#9BB8D0", fontSize: "14px" }}>
                          No status changes recorded yet.
                        </td>
                      </tr>
                    ) : (
                      data.timeline.map((row, i) => (
                        <tr
                          key={i}
                          style={{ background: i % 2 === 0 ? "#fff" : "#F9FBFD" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#EEF5FC"}
                          onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#F9FBFD"}
                        >
                          <td style={{ padding: "13px 16px", fontSize: "13px", fontWeight: "700", textAlign: "center", color: "#1a2b45", borderBottom: "1px solid #F0F6FC" }}>{row.complaintCode}</td>
                          <td style={{ padding: "13px 16px", fontSize: "13px", textAlign: "center", color: "#2d3748", borderBottom: "1px solid #F0F6FC" }}>{row.title}</td>
                          <td style={{ padding: "13px 16px", textAlign: "center", borderBottom: "1px solid #F0F6FC" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                              ...(row.oldStatus === "Pending" ? { background: "#FEF08A", color: "#854D0E" } :
                                  row.oldStatus === "In Review" ? { background: "#BAE6FD", color: "#075985" } :
                                  row.oldStatus === "Resolved" ? { background: "#BBF7D0", color: "#166534" } :
                                  { background: "#F3F4F6", color: "#6B7280" })
                            }}>
                              {row.oldStatus}
                            </span>
                          </td>
                          <td style={{ padding: "13px 16px", textAlign: "center", borderBottom: "1px solid #F0F6FC" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                              ...(row.newStatus === "Pending" ? { background: "#FEF08A", color: "#854D0E" } :
                                  row.newStatus === "In Review" ? { background: "#BAE6FD", color: "#075985" } :
                                  row.newStatus === "Resolved" ? { background: "#BBF7D0", color: "#166534" } :
                                  { background: "#F3F4F6", color: "#6B7280" })
                            }}>
                              {row.newStatus}
                            </span>
                          </td>
                          <td style={{ padding: "13px 16px", fontSize: "13px", textAlign: "center", color: "#4A5568", borderBottom: "1px solid #F0F6FC" }}>{row.changedAt}</td>
                          <td style={{ padding: "13px 16px", fontSize: "13px", textAlign: "center", color: "#4A5568", borderBottom: "1px solid #F0F6FC" }}>
                            {row.hoursInPrevStatus != null ? `${row.hoursInPrevStatus}h` : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
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