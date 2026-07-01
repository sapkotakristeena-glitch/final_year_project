import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeSimple, LockSimple, Eye, EyeSlash } from "@phosphor-icons/react";

export default function Login() {
  const navigate = useNavigate();

  const [showPw, setShowPw]           = useState(false);
  const [focused, setFocused]         = useState(null);
  const [remember, setRemember]       = useState(false);
  const [btnHover, setBtnHover]       = useState(false);
  const [forgotHover, setForgotHover] = useState(false);
  const [signupHover, setSignupHover] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const inputStyle = (field) => ({
    width: "100%",
    padding: "14px 16px 14px 42px",
    border: `1.5px solid ${focused === field ? "#2471A3" : "#C5D9EE"}`,
    borderRadius: "10px",
    background: "#F0F6FC",
    fontSize: "14px",
    color: "#1a2b45",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: focused === field ? "0 0 0 3px rgba(36,113,163,0.12)" : "none",
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "admin") navigate("/admin");
      else navigate("/user");
    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      margin: 0,
      height: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0,
      fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: "#1a2b45",
      background: "#DDE6F0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflowY: "auto",
      boxSizing: "border-box",
      padding: "24px",
      gap: "24px",
    }}>

      {/* Brand — outside the card */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          margin: "0 0 6px",
          fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "#1D70B8",
          fontWeight: 800,
        }}>
          SolveIT
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "#718096" }}>
          Professional complaint tracking and resolution platform
        </p>
      </div>

      {/* Login card */}
      <div style={{
        width: "min(100%, 520px)",
        padding: "42px 36px",
        background: "#ffffff",
        borderRadius: "18px",
        border: "1.5px solid #C5D9EE",
        boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
        textAlign: "left",
        boxSizing: "border-box",
      }}>

        <h2 style={{
          margin: "0 0 28px",
          fontSize: "28px",
          fontWeight: 700,
          color: "#1D70B8",
        }}>
          Welcome back!
        </h2>

        {/* Email / Username field */}
        <div style={{ display: "grid", gap: "8px", marginBottom: "18px" }}>
          <label htmlFor="email" style={{ fontSize: "13px", fontWeight: "600", color: "#4A5568" }}>
            Email Address
          </label>
          <div style={{ position: "relative" }}>
            <EnvelopeSimple
              size={16}
              color={focused === "email" ? "#2471A3" : "#9BB8D0"}
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle("email")}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </div>

        {/* Password field */}
        <div style={{ display: "grid", gap: "8px", marginBottom: "18px" }}>
          <label htmlFor="password" style={{ fontSize: "13px", fontWeight: "600", color: "#4A5568" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <LockSimple
              size={16}
              color={focused === "password" ? "#2471A3" : "#9BB8D0"}
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
            <input
              type={showPw ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle("password"), paddingRight: "44px" }}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#9BB8D0", display: "flex", alignItems: "center", padding: 0,
              }}
            >
              {showPw ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember me + Forgot */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "16px", marginBottom: "28px", fontSize: "13px", color: "#4A5568",
        }}>
          {/* Custom checkbox */}
          <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <div
              onClick={() => setRemember(!remember)}
              style={{
                width: "18px", height: "18px",
                borderRadius: "5px",
                border: `2px solid ${remember ? "#1D70B8" : "#C5D9EE"}`,
                background: remember ? "#1D70B8" : "#F0F6FC",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              {remember && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <polyline points="1,4 4,7 9,1" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            Remember Me
          </label>

          <a
            href="#"
            style={{ color: "#1D70B8", textDecoration: forgotHover ? "underline" : "none", fontWeight: "500" }}
            onMouseEnter={() => setForgotHover(true)}
            onMouseLeave={() => setForgotHover(false)}
          >
            Forgot password?
          </a>
        </div>

        {error && (
          <div style={{ fontSize: "13px", color: "#E53E3E", marginBottom: "12px", textAlign: "center" }}>
            {error}
          </div>
        )}
              
        {/* Login button */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px 0",
            border: "none",
            borderRadius: "10px",
            background: btnHover ? "#155a94" : "#1D70B8",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s",
            boxShadow: "0 4px 12px rgba(29,112,184,0.3)",
          }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Sign up */}
        <p style={{ marginTop: "24px", marginBottom: 0, fontSize: "13px", color: "#718096", textAlign: "center" }}>
          Haven't registered yet?{" "}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate("/registration"); }}
            style={{ color: "#1D70B8", textDecoration: signupHover ? "underline" : "none", fontWeight: 600 }}
            onMouseEnter={() => setSignupHover(true)}
            onMouseLeave={() => setSignupHover(false)}
          >
            Register now
          </a>
        </p>

      </div>
    </div>
  );
}