import { useState, useEffect } from "react";
import {
  SquaresFour,
  Bell,
  User,
  SignOut,
  FileText,
  Clock,
  ArrowsClockwise,
  CheckCircle,
} from "@phosphor-icons/react";

export default function SolveIT() {
  const [activeNav, setActiveNav] = useState("dashboard");
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

 
    useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const complaintsRes = await fetch("http://127.0.0.1:5000/complaints");
            const complaintsData = await complaintsRes.json();

            setRecentComplaints(complaintsData);
            setStats({
                total: complaintsData.length,
                pending: complaintsData.length,
                inProgress: 0,
                resolved: 0
            });
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDashboardData();
}, []);
 

  const colors = {
    sidebarBg: "#f0f4fc",
    sidebarActive: "#dde8f8",
    sidebarText: "#4a6490",
    sidebarActiveText: "#1b4f8a",
    mainBg: "#dbe4f0", 
    topbarBg: "#ffffff",
    cardBg: "#ffffff",
    accentBlue: "#005689", 
    textMain: "#1b4f8a",
    textSub: "#6b7fa3",
    tableHeader: "#d1d5db",
  };

  const s = {
    root: { display: "flex", height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: colors.mainBg, overflow: "hidden", margin: 0 },
    sidebar: { width: "clamp(200px, 18vw, 240px)", background: colors.sidebarBg, borderRight: "1px solid #dce4f0", display: "flex", flexDirection: "column", flexShrink: 1 },
    logo: { padding: "24px 24px", fontSize: 24, fontWeight: "bold", color: colors.sidebarActiveText },
    userProfile: { display: "flex", alignItems: "center", gap: 12, margin: "0 15px 20px", padding: "10px", background: colors.sidebarActive, borderRadius: 12 },
    navItem: (active) => ({ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", margin: "4px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 400, color: active ? colors.sidebarActiveText : colors.sidebarText, background: active ? colors.sidebarActive : "transparent", textAlign: "left", width: "calc(100% - 24px)", transition: "background 0.2s" }),
    main: { flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" },
    topbar: { height: 60, background: colors.topbarBg, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 30px", gap: 20, flexShrink: 0 },
    topIcon: { cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: "50%", transition: "background 0.2s" },
    content: { padding: "30px" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 25 },
    statCard: { background: colors.cardBg, padding: "20px", borderRadius: 15, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
    manageGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 25 },
    manageCard: { background: colors.cardBg, padding: "25px", borderRadius: 15, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
    btnBlue: { width: "100%", padding: "12px", background: colors.accentBlue, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", marginTop: 15 },
    btnOutline: { width: "100%", padding: "12px", background: "transparent", color: colors.accentBlue, border: `1px solid ${colors.accentBlue}`, borderRadius: 6, fontWeight: 600, cursor: "pointer", marginTop: 15 },
    tableCard: { background: colors.cardBg, padding: "25px", borderRadius: 15, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: 15 },
    th: { background: colors.tableHeader, padding: "12px", textAlign: "left", fontSize: 13, fontWeight: 600 },
    td: { padding: "15px 12px", borderBottom: "1px solid #eee", fontSize: 13 }
  };

  const statConfig = [
    { label: "Total", count: stats.total, sub: "All complaints", color: "#4caf50", Icon: FileText },
    { label: "Pending", count: stats.pending, sub: "Needs attention", color: "#ff9800", Icon: Clock },
    { label: "In Progress", count: stats.inProgress, sub: "Being worked on", color: "#3f51b5", Icon: ArrowsClockwise },
    { label: "Resolved", count: stats.resolved, sub: "Completed", color: "#4caf50", Icon: CheckCircle },
  ];

  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.logo}>SolveIT</div>
        <div style={s.userProfile}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f8bbd0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={24} color="#e91e63" weight="fill" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#333" }}>@ADMIN</div>
            <div style={{ fontSize: 11, color: "#777" }}>Admin</div>
          </div>
        </div>
        <nav>
          {[
            { id: "dashboard", label: "Dashboard", Icon: SquaresFour },
            /* Removed Submit and My Complaints for Admin */
          ].map(({ id, label, Icon }) => (
            <button key={id} style={s.navItem(activeNav === id)} onClick={() => setActiveNav(id)}>
              <Icon size={20} weight={activeNav === id ? "fill" : "regular"} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div style={s.main}>
        <header style={s.topbar}>
          <div style={s.topIcon} onClick={() => alert("Notifications")}><Bell size={24} color={colors.sidebarActiveText} weight="fill" /></div>
          <div style={s.topIcon} onClick={() => alert("Profile")}><User size={24} color={colors.sidebarActiveText} weight="fill" /></div>
          <div style={s.topIcon} onClick={() => alert("Signing out")}><SignOut size={24} color={colors.sidebarActiveText} weight="fill" /></div>
        </header>

        <main style={s.content}>
          <div style={{ marginBottom: 25 }}>
            <h1 style={{ color: colors.textMain, fontSize: 32, margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: colors.textSub, margin: "5px 0" }}>Monitor and manage all complaints</p>
          </div>

          <div style={s.statsGrid}>
            {statConfig.map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{stat.label}</div>
                    <div style={{ fontSize: 36, fontWeight: "bold", margin: "10px 0" }}>
                        {loading ? "..." : stat.count}
                    </div>
                    <div style={{ fontSize: 12, color: "#777" }}>{stat.sub}</div>
                  </div>
                  <stat.Icon size={20} color={stat.color} weight="fill" />
                </div>
              </div>
            ))}
          </div>

          <div style={s.manageGrid}>
            <div style={s.manageCard}>
              <h3 style={{ margin: 0, color: colors.textMain }}>Manage All Complaints</h3>
              <p style={{ fontSize: 13, color: "#777" }}>View, assign, and update complaint statuses</p>
              <button style={s.btnBlue}>View All Complaints</button>
            </div>
            <div style={s.manageCard}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ margin: 0, color: colors.textMain }}>View Reports & Analytics</h3>
                <FileText size={20} color="#4caf50" weight="fill" />
              </div>
              <p style={{ fontSize: 13, color: "#777" }}>Analyze complaint trends and performance</p>
              <button style={s.btnOutline}>View Reports</button>
            </div>
          </div>

          <div style={s.tableCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
              <div>
                <h3 style={{ margin: 0, color: colors.textMain }}>Recent Complaints</h3>
                <p style={{ fontSize: 12, color: "#777", margin: 0 }}>Latest submitted complaints</p>
              </div>
              <button style={{ padding: "5px 15px", background: "#ddd", border: "none", borderRadius: 5, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>view all</button>
            </div>
            <table style={s.table}>
              <thead>
                <tr>
                  {["ID", "Complaint", "Category", "Date"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                  {/* Removed User, Priority, Status headers */}
                </tr>
              </thead>
              <tbody>
                {recentComplaints.length > 0 ? (
                  recentComplaints.map((comp) => (
                    <tr key={comp.id}>
                        
                        <td style={s.td}>#{comp.id}</td>
                        <td style={s.td}>{comp.complaint_text}</td>
                        <td style={s.td}>{comp.category}</td>
                        <td style={s.td}>
                            {new Date(comp.submitted_at).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric",
                                hour: "2-digit", minute: "2-digit"
                            })}
                        </td>
                      
                     
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ ...s.td, textAlign: "center", padding: "30px", color: colors.textSub }}>
                      {loading ? "Loading complaints..." : "No recent complaints found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}