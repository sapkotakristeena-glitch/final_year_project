import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, CheckCircle, WarningCircle } from "@phosphor-icons/react";

export default function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    emailAddress: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const MUNICIPALITIES = [
  // Kathmandu District
  "Kathmandu Metropolitan City",
  "Kirtipur Municipality",
  "Chandragiri Municipality",
  "Nagarjun Municipality",
  "Tokha Municipality",
  "Budhanilkantha Municipality",
  "Tarakeshwor Municipality",
  "Gokarneshwor Municipality",
  "Kageshwori Manohara Municipality",
  "Sankharapur Municipality",
  "Dakshinkali Municipality",
  // Lalitpur District
  "Lalitpur Metropolitan City",
  "Mahalaxmi Municipality",
  "Godawari Municipality",
  "Konjyosom Rural Municipality",
  "Bagmati Rural Municipality",
  "Mahankal Rural Municipality",
  // Bhaktapur District
  "Bhaktapur Municipality",
  "Madhyapur Thimi Municipality",
  "Suryabinayak Municipality",
  "Changunarayan Municipality",
];

  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required.";

    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required.";
    else if (!/^\+?[\d\s\-().]{7,15}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Enter a valid contact number.";

    if (!formData.location)
      newErrors.location = "Please select your location.";

    if (!formData.emailAddress.trim())
      newErrors.emailAddress = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress))
      newErrors.emailAddress = "Enter a valid email address.";

    if (!formData.password)
      newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setApiError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email:    formData.emailAddress,
          phone:    formData.contactNumber,
          location: formData.location,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setApiError(data.error || "Registration failed.");
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setApiError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ fullName: "", contactNumber: "", emailAddress: "", location: "", password: "", confirmPassword: "" });
    setErrors({});
    setSubmitted(false);
  };

  const inputStyle = (fieldName, hasError) => ({
    background: "#F0F6FC",
    border: `1.5px solid ${hasError ? "#E53E3E" : focused === fieldName ? "#2471A3" : "#C5D9EE"}`,
    borderRadius: "10px",
    boxShadow: focused === fieldName
      ? hasError
        ? "0 0 0 3px rgba(229,62,62,0.12)"
        : "0 0 0 3px rgba(36,113,163,0.12)"
      : "none",
    outline: "none",
    height: "42px",
    padding: "0 12px",
    fontSize: "14px",
    color: "#1a2b45",
    width: "100%",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  });

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: "6px",
  };

  const errorStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "5px",
    fontSize: "11.5px",
    color: "#E53E3E",
    fontWeight: "500",
  };

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <div style={errorStyle}>
        <WarningCircle size={13} weight="fill" color="#E53E3E" />
        {errors[field]}
      </div>
    ) : null;

  const outerWrap = {
    position: "fixed",
    top: 0,
    left: 0,
    overflowY: "auto",
    height: "100vh",
    width: "100vw",
    background: "#DDE6F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  };

  const card = {
    background: "#FFFFFF",
    borderRadius: "18px",
    border: "1.5px solid #C5D9EE",
    boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
    padding: "36px 40px 40px 40px",
    width: "560px",
    maxWidth: "95vw",
    position: "relative",
    boxSizing: "border-box",
  };

  // ── Success screen ────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={outerWrap}>
        <div style={{ ...card, textAlign: "center", padding: "52px 40px" }}>
          <CheckCircle
            size={72}
            weight="fill"
            color="#2471A3"
            style={{ marginBottom: "20px" }}
          />
          <h2 style={{ color: "#1D70B8", fontSize: "24px", fontWeight: "700", margin: "0 0 10px" }}>
            Account Created!
          </h2>
          <p style={{ color: "#4A5568", fontSize: "14px", margin: "0 0 6px" }}>
            Welcome, <strong>{formData.fullName}</strong>. Your account has been registered successfully.
          </p>
          <p style={{ color: "#718096", fontSize: "13px", margin: "0 0 32px" }}>
            A confirmation has been sent to <strong>{formData.emailAddress}</strong>.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#1D70B8",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              padding: "11px 36px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(29,112,184,0.3)",
            }}
            onMouseEnter={(e) => e.target.style.background = "#155a94"}
            onMouseLeave={(e) => e.target.style.background = "#1D70B8"}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────
  return (
    <div style={outerWrap}>
      <div style={card}>

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "28px",
        }}>
          <h1 style={{
            color: "#1D70B8",
            fontSize: "26px",
            fontWeight: "700",
            margin: 0,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}>
            User Registration
          </h1>
          <div style={{
            width: "84px",
            height: "84px",
            borderRadius: "50%",
            background: "#F5E6E0",
            border: "2.5px solid #C5D9EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "2px 4px 12px rgba(100,160,210,0.18)",
            flexShrink: 0,
            marginTop: "-8px",
            overflow: "hidden",
          }}>
            <UserIcon size={64} weight="fill" color="#7FB3D5" />
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={inputStyle("fullName", !!errors.fullName)}
              onFocus={() => setFocused("fullName")}
              onBlur={() => setFocused(null)}
            />
            <ErrorMsg field="fullName" />
          </div>

          {/* Contact Number */}
          <div>
            <label style={labelStyle}>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              style={inputStyle("contactNumber", !!errors.contactNumber)}
              onFocus={() => setFocused("contactNumber")}
              onBlur={() => setFocused(null)}
            />
            <ErrorMsg field="contactNumber" />
          </div>

          {/* Email Address */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              style={inputStyle("emailAddress", !!errors.emailAddress)}
              onFocus={() => setFocused("emailAddress")}
              onBlur={() => setFocused(null)}
            />
            <ErrorMsg field="emailAddress" />
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{
                ...inputStyle("location", !!errors.location),
                height: "42px",
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                paddingRight: "36px",
              }}
              onFocus={() => setFocused("location")}
              onBlur={() => setFocused(null)}
            >
              <option value="">Select your municipality</option>
              {MUNICIPALITIES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ErrorMsg field="location" />
          </div>

          {/* Password + Confirm Password */}
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle("password", !!errors.password)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
              />
              <ErrorMsg field="password" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={inputStyle("confirmPassword", !!errors.confirmPassword)}
                onFocus={() => setFocused("confirmPassword")}
                onBlur={() => setFocused(null)}
              />
              <ErrorMsg field="confirmPassword" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "32px", gap: "10px" }}>
          {apiError && (
            <div style={{ fontSize: "13px", color: "#E53E3E", textAlign: "center" }}>
              {apiError}
            </div>
          )}
          <button
            onClick={handleSubmit}
            style={{
              background: "#1D70B8",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              padding: "12px 44px",
              fontSize: "15px",
              fontWeight: "600",
              letterSpacing: "0.02em",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(29,112,184,0.3)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.target.style.background = "#155a94"}
            onMouseLeave={(e) => e.target.style.background = "#1D70B8"}
          >
            {loading ? "Registering..." : "Register as User"}
          </button>
        </div>

      </div>
    </div>
  );
}