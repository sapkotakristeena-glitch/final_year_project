import { useState, useRef } from "react";


const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "submit",
    label: "Submit Complaint",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    id: "my-complaints",
    label: "My Complaints",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
];


const CATEGORIES = [
  "Technical Issue",
  "Billing & Payments",
  "Account Access",
  "Service Outage",
  "Feature Request",
  "Security Concern",
  "Other",
];


export default function SolveIT() {
  const [activeNav, setActiveNav] = useState("submit");
  const [form, setForm] = useState({ title: "", category: "", description: "" });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectOpen, setSelectOpen] = useState(false);
  const fileInputRef = useRef();


  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Complaint title is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };


  const handleSubmit = () => {
      const e = validate();
      if (Object.keys(e).length > 0) { setErrors(e); return; }

      fetch("http://127.0.0.1:5000/classify", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              complaint: form.description
          }),
      })
      .then((res) => res.json())
      .then((data) => {
          console.log("Backend response:", data);
          setSubmitted(true);
      })
      .catch((err) => {
          console.log("Error:", err);
          alert("Something went wrong. Make sure the backend is running.");
      });
  };

  const handleReset = () => {
    setForm({ title: "", category: "", description: "" });
    setFile(null);
    setErrors({});
    setSubmitted(false);
  };


  const handleFile = (f) => {
    if (f) setFile(f);
  };


  const styles = {
    root: {
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: "flex",
      height: "100vh",
      background: "#f0f4f8",
      overflow: "hidden",
    },
    sidebar: {
      width: 240,
      background: "#fff",
      borderRight: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      padding: "0",
      flexShrink: 0,
    },
    logo: {
      padding: "24px 24px 20px",
      fontSize: 22,
      fontWeight: 800,
      color: "#1a56db",
      letterSpacing: "-0.5px",
      borderBottom: "1px solid #f1f5f9",
    },
    logoIT: { color: "#0ea5e9" },
    userCard: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "16px 20px",
      margin: "12px",
      background: "#f0f7ff",
      borderRadius: 12,
      border: "1px solid #dbeafe",
    },
    avatar: {
      width: 38,
      height: 38,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #1a56db, #0ea5e9)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 16,
      fontWeight: 700,
      flexShrink: 0,
    },
    userName: { fontSize: 14, fontWeight: 600, color: "#1e293b" },
    userRole: { fontSize: 12, color: "#64748b" },
    nav: { display: "flex", flexDirection: "column", gap: 2, padding: "8px 12px", flex: 1 },
    navItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 14px",
      borderRadius: 10,
      cursor: "pointer",
      fontSize: 14,
      fontWeight: active ? 600 : 400,
      color: active ? "#1a56db" : "#475569",
      background: active ? "#eff6ff" : "transparent",
      border: "none",
      transition: "all 0.15s",
      textAlign: "left",
      width: "100%",
    }),
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    topbar: {
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      padding: "0 28px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 8,
    },
    iconBtn: {
      width: 38,
      height: 38,
      borderRadius: 10,
      border: "1px solid #e2e8f0",
      background: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#475569",
      transition: "all 0.15s",
    },
    content: {
      flex: 1,
      overflow: "auto",
      padding: "32px",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    card: {
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #e2e8f0",
      padding: "36px 40px",
      width: "100%",
      maxWidth: 680,
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    },
    heading: {
      fontSize: 22,
      fontWeight: 700,
      color: "#0f172a",
      marginBottom: 6,
    },
    subtext: { fontSize: 14, color: "#64748b", marginBottom: 32 },
    fieldGroup: { marginBottom: 24 },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 600,
      color: "#374151",
      marginBottom: 8,
    },
    requiredStar: { color: "#ef4444", marginLeft: 2 },
    input: (hasError) => ({
      width: "100%",
      padding: "11px 16px",
      border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
      borderRadius: 10,
      fontSize: 14,
      color: "#1e293b",
      background: "#fff",
      outline: "none",
      transition: "border-color 0.15s",
      boxSizing: "border-box",
      fontFamily: "inherit",
    }),
    textarea: (hasError) => ({
      width: "100%",
      padding: "11px 16px",
      border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
      borderRadius: 10,
      fontSize: 14,
      color: "#1e293b",
      background: "#fff",
      outline: "none",
      resize: "vertical",
      minHeight: 110,
      fontFamily: "inherit",
      transition: "border-color 0.15s",
      boxSizing: "border-box",
    }),
    selectWrapper: { position: "relative" },
    selectDisplay: (hasError, open) => ({
      width: "100%",
      padding: "11px 16px",
      border: `1.5px solid ${hasError ? "#ef4444" : open ? "#1a56db" : "#e2e8f0"}`,
      borderRadius: open ? "10px 10px 0 0" : 10,
      fontSize: 14,
      color: form.category ? "#1e293b" : "#94a3b8",
      background: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      userSelect: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s",
    }),
    dropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: "#fff",
      border: "1.5px solid #1a56db",
      borderTop: "none",
      borderRadius: "0 0 10px 10px",
      zIndex: 50,
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    dropdownItem: (active) => ({
      padding: "10px 16px",
      fontSize: 14,
      color: active ? "#1a56db" : "#374151",
      background: active ? "#eff6ff" : "#fff",
      cursor: "pointer",
      fontWeight: active ? 600 : 400,
      transition: "background 0.1s",
    }),
    uploadZone: (drag) => ({
      border: `2px dashed ${drag ? "#1a56db" : "#cbd5e1"}`,
      borderRadius: 12,
      padding: "28px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      cursor: "pointer",
      background: drag ? "#eff6ff" : "#f8fafc",
      transition: "all 0.2s",
    }),
    uploadIcon: { color: "#94a3b8", marginBottom: 4 },
    uploadText: { fontSize: 14, color: "#1a56db", fontWeight: 500 },
    uploadSub: { fontSize: 12, color: "#94a3b8" },
    fileName: {
      fontSize: 13,
      color: "#1a56db",
      background: "#eff6ff",
      padding: "6px 14px",
      borderRadius: 20,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    },
    errorText: { fontSize: 12, color: "#ef4444", marginTop: 5 },
    btnRow: { display: "flex", gap: 12, marginTop: 32, justifyContent: "flex-end" },
    btnSubmit: {
      padding: "12px 28px",
      background: "linear-gradient(135deg, #1a56db, #0ea5e9)",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      letterSpacing: "0.2px",
      boxShadow: "0 4px 14px rgba(26, 86, 219, 0.3)",
      transition: "all 0.2s",
    },
    btnCancel: {
      padding: "12px 24px",
      background: "#fff",
      color: "#475569",
      border: "1.5px solid #e2e8f0",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    successWrap: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 0",
      gap: 16,
    },
    successIcon: {
      width: 72,
      height: 72,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 24px rgba(34, 197, 94, 0.3)",
      marginBottom: 8,
    },
    successTitle: { fontSize: 22, fontWeight: 700, color: "#0f172a" },
    successSub: { fontSize: 14, color: "#64748b", textAlign: "center", maxWidth: 360 },
    btnNewTicket: {
      marginTop: 8,
      padding: "12px 28px",
      background: "linear-gradient(135deg, #1a56db, #0ea5e9)",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 4px 14px rgba(26, 86, 219, 0.3)",
    },
  };


  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          Solve<span style={styles.logoIT}>IT</span>
        </div>
        <div style={styles.userCard}>
          <div style={styles.avatar}>U</div>
          <div>
            <div style={styles.userName}>@Username</div>
            <div style={styles.userRole}>User</div>
          </div>
        </div>
        <nav style={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              style={styles.navItem(activeNav === item.id)}
              onClick={() => setActiveNav(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>


      {/* Main */}
      <div style={styles.main}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <button style={styles.iconBtn} title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button style={styles.iconBtn} title="Profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button style={styles.iconBtn} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </header>


        {/* Content */}
        <main style={styles.content}>
          <div style={styles.card}>
            {submitted ? (
              <div style={styles.successWrap}>
                <div style={styles.successIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div style={styles.successTitle}>Complaint Submitted!</div>
                <p style={styles.successSub}>
                  Your complaint has been received. Our team will review it shortly and get back to you.
                </p>
                <button style={styles.btnNewTicket} onClick={handleReset}>
                  Submit Another Complaint
                </button>
              </div>
            ) : (
              <>
                <h1 style={styles.heading}>Submit New Complaint</h1>
                <p style={styles.subtext}>
                  Fill in the below to submit your complaint. Our team will review it shortly.
                </p>


                {/* Title */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    Complaint Title<span style={styles.requiredStar}>*</span>
                  </label>
                  <input
                    style={styles.input(!!errors.title)}
                    placeholder="Brief description of your complaint"
                    value={form.title}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, title: e.target.value }));
                      setErrors((err) => ({ ...err, title: "" }));
                    }}
                  />
                  {errors.title && <div style={styles.errorText}>{errors.title}</div>}
                </div>


                {/* Category */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    Category<span style={styles.requiredStar}>*</span>
                  </label>
                  <div style={styles.selectWrapper}>
                    <div
                      style={styles.selectDisplay(!!errors.category, selectOpen)}
                      onClick={() => setSelectOpen((v) => !v)}
                    >
                      <span>{form.category || "select a category"}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ transform: selectOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    {selectOpen && (
                      <div style={styles.dropdown}>
                        {CATEGORIES.map((cat) => (
                          <div
                            key={cat}
                            style={styles.dropdownItem(form.category === cat)}
                            onClick={() => {
                              setForm((f) => ({ ...f, category: cat }));
                              setErrors((err) => ({ ...err, category: "" }));
                              setSelectOpen(false);
                            }}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.category && <div style={styles.errorText}>{errors.category}</div>}
                </div>


                {/* Description */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    Description<span style={styles.requiredStar}>*</span>
                  </label>
                  <textarea
                    style={styles.textarea(!!errors.description)}
                    placeholder="Provide detailed information about your complaint"
                    value={form.description}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, description: e.target.value }));
                      setErrors((err) => ({ ...err, description: "" }));
                    }}
                  />
                  {errors.description && <div style={styles.errorText}>{errors.description}</div>}
                </div>


                {/* Attachments */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Attachments (Optional)</label>
                  <div
                    style={styles.uploadZone(dragOver)}
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => handleFile(e.target.files[0])}
                    />
                    {file ? (
                      <div style={styles.fileName}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        {file.name}
                        <button
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 0 }}
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        >✕</button>
                      </div>
                    ) : (
                      <>
                        <div style={styles.uploadIcon}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <span style={styles.uploadText}>Click to upload file</span>
                        <span style={styles.uploadSub}>or drag and drop here</span>
                      </>
                    )}
                  </div>
                </div>


                {/* Actions */}
                <div style={styles.btnRow}>
                  <button style={styles.btnCancel} onClick={handleReset}>
                    Cancel
                  </button>
                  <button style={styles.btnSubmit} onClick={handleSubmit}>
                    Submit your complaint
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

