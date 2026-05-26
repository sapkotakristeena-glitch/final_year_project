import { useState } from "react";
import { UserIcon, CheckCircle, WarningCircle } from "@phosphor-icons/react";

export default function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error for this field as user types
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

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ fullName: "", contactNumber: "", emailAddress: "", password: "", confirmPassword: "" });
    setErrors({});
    setSubmitted(false);
  };

  const inputStyle = (hasError) => ({
    background: "linear-gradient(145deg, #ddeeff 0%, #f0f7ff 60%, #ffffff 100%)",
    border: `1.5px solid ${hasError ? "#E53E3E" : "#7FB3D5"}`,
    borderRadius: "12px",
    boxShadow: hasError
      ? "inset 2px 3px 7px rgba(229,62,62,0.10), inset 0 1px 3px rgba(229,62,62,0.08)"
      : "inset 2px 3px 7px rgba(100, 160, 210, 0.22), inset 0 1px 3px rgba(80,130,180,0.13)",
    outline: "none",
    height: "38px",
    padding: "0 12px",
    fontSize: "14px",
    color: "#2d3748",
    width: "100%",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  });

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    color: "#4A5568",
    marginBottom: "4px",
    fontWeight: "500",
    letterSpacing: "0.01em",
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

  const focusHandlers = (fieldName) => ({
    onFocus: (e) => {
      e.target.style.borderColor = errors[fieldName] ? "#E53E3E" : "#2471A3";
      e.target.style.boxShadow = errors[fieldName]
        ? "inset 2px 3px 7px rgba(229,62,62,0.10), 0 0 0 2px rgba(229,62,62,0.12)"
        : "inset 2px 3px 7px rgba(100,160,210,0.22), inset 0 1px 3px rgba(80,130,180,0.13), 0 0 0 2px rgba(36,113,163,0.1)";
    },
    onBlur: (e) => {
      e.target.style.borderColor = errors[fieldName] ? "#E53E3E" : "#7FB3D5";
      e.target.style.boxShadow = errors[fieldName]
        ? "inset 2px 3px 7px rgba(229,62,62,0.10), inset 0 1px 3px rgba(229,62,62,0.08)"
        : "inset 2px 3px 7px rgba(100, 160, 210, 0.22), inset 0 1px 3px rgba(80,130,180,0.13)";
    },
  });

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
    minHeight: "100vh",
    background: "#E4ECF2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  };

  const card = {
    background: "#FFFFFF",
    borderRadius: "24px",
    boxShadow: "6px 6px 20px rgba(0,0,0,0.1)",
    padding: "36px 40px 40px 40px",
    width: "560px",
    maxWidth: "95vw",
    position: "relative",
    boxSizing: "border-box",
  };

  // ── Success screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={outerWrap}>
        <div style={{ ...card, textAlign: "center", padding: "52px 40px" }}>
          <CheckCircle size={72} weight="fill" color="#2471A3" style={{ marginBottom: "20px" }} />
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
            onClick={handleReset}
            style={{
              background: "#2471A3",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              padding: "11px 36px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(36,113,163,0.35)",
            }}
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  // ── Registration form ───────────────────────────────────────────
  return (
    <div style={outerWrap}>
      <div style={card}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
          <h1 style={{ color: "#1D70B8", fontSize: "26px", fontWeight: "600", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            User Registration
          </h1>
          <div style={{
            width: "84px", height: "84px", borderRadius: "50%",
            background: "#F5E6E0", border: "2.5px solid #7FB3D5",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "2px 4px 12px rgba(100,160,210,0.18)",
            flexShrink: 0, marginTop: "-8px", overflow: "hidden",
          }}>
            <UserIcon size={64} weight="fill" color="#7FB3D5" />
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName}
              onChange={handleChange} style={inputStyle(!!errors.fullName)} {...focusHandlers("fullName")} />
            <ErrorMsg field="fullName" />
          </div>

          {/* Contact Number */}
          <div>
            <label style={labelStyle}>Contact Number</label>
            <input type="tel" name="contactNumber" value={formData.contactNumber}
              onChange={handleChange} style={inputStyle(!!errors.contactNumber)} {...focusHandlers("contactNumber")} />
            <ErrorMsg field="contactNumber" />
          </div>

          {/* Email Address */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="emailAddress" value={formData.emailAddress}
              onChange={handleChange} style={inputStyle(!!errors.emailAddress)} {...focusHandlers("emailAddress")} />
            <ErrorMsg field="emailAddress" />
          </div>

          {/* Password + Confirm Password */}
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={formData.password}
                onChange={handleChange} style={inputStyle(!!errors.password)} {...focusHandlers("password")} />
              <ErrorMsg field="password" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} style={inputStyle(!!errors.confirmPassword)} {...focusHandlers("confirmPassword")} />
              <ErrorMsg field="confirmPassword" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
          <button
            onClick={handleSubmit}
            style={{
              background: "#2471A3", color: "#FFFFFF", border: "none",
              borderRadius: "10px", padding: "11px 44px", fontSize: "15px",
              fontWeight: "600", letterSpacing: "0.02em", cursor: "pointer",
              boxShadow: "0 6px 16px rgba(36,113,163,0.38), 0 2px 4px rgba(0,0,0,0.12)",
              transition: "background 0.18s, box-shadow 0.18s, transform 0.1s",
            }}
            onMouseEnter={(e) => { e.target.style.background = "#1a5c8a"; e.target.style.boxShadow = "0 8px 20px rgba(36,113,163,0.45)"; }}
            onMouseLeave={(e) => { e.target.style.background = "#2471A3"; e.target.style.boxShadow = "0 6px 16px rgba(36,113,163,0.38), 0 2px 4px rgba(0,0,0,0.12)"; }}
            onMouseDown={(e) => { e.target.style.transform = "translateY(1px)"; e.target.style.boxShadow = "0 3px 8px rgba(36,113,163,0.3)"; }}
            onMouseUp={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 16px rgba(36,113,163,0.38), 0 2px 4px rgba(0,0,0,0.12)"; }}
          >
            Register as User
          </button>
        </div>
      </div>
    </div>
  );
}