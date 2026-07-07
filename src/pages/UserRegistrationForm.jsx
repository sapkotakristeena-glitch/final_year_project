import { useState, useEffect, useRef } from "react";
import { User as UserIcon, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const MUNICIPALITIES = [
  "Bagmati Rural Municipality",
  "Bhaktapur Municipality",
  "Budhanilkantha Municipality",
  "Chandragiri Municipality",
  "Changunarayan Municipality",
  "Dakshinkali Municipality",
  "Gokarneshwor Municipality",
  "Godawari Municipality",
  "Kageshwori Manohara Municipality",
  "Kathmandu Metropolitan City",
  "Kirtipur Municipality",
  "Konjyosom Rural Municipality",
  "Lalitpur Metropolitan City",
  "Madhyapur Thimi Municipality",
  "Mahalaxmi Municipality",
  "Mahankal Rural Municipality",
  "Nagarjun Municipality",
  "Sankharapur Municipality",
  "Suryabinayak Municipality",
  "Tarakeshwor Municipality",
  "Tokha Municipality",
].sort();

export default function UserRegistrationForm() {
  const navigate     = useNavigate();
  const dropdownRef  = useRef(null);

  const [formData, setFormData] = useState({
    fullName:        "",
    contactNumber:   "",
    emailAddress:    "",
    location:        "",
    password:        "",
    confirmPassword: "",
  });

  const [errors, setErrors]             = useState({});
  const [submitted, setSubmitted]       = useState(false);
  const [focused, setFocused]           = useState(null);
  const [loading, setLoading]           = useState(false);
  const [apiError, setApiError]         = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  const filteredMunicipalities = MUNICIPALITIES.filter(m =>
    m.toLowerCase().includes(locationSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLocationOpen(false);
        setLocationSearch(formData.location);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [formData.location]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
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
    if (!formData.location)
      newErrors.location = "Please select your location.";
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
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
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
      if (!response.ok) { setApiError(data.error || "Registration failed."); return; }
      setSubmitted(true);
    } catch (err) {
      setApiError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName, hasError) => ({
    background:   "#F0F6FC",
    border:       `1.5px solid ${hasError ? "#E53E3E" : focused === fieldName ? "#2471A3" : "#C5D9EE"}`,
    borderRadius: "10px",
    boxShadow:    focused === fieldName
      ? hasError ? "0 0 0 3px rgba(229,62,62,0.12)" : "0 0 0 3px rgba(36,113,163,0.12)"
      : "none",
    outline:      "none",
    height:       "42px",
    padding:      "0 12px",
    fontSize:     "14px",
    color:        "#1a2b45",
    width:        "100%",
    transition:   "border-color 0.2s, box-shadow 0.2s",
    boxSizing:    "border-box",
    fontFamily:   "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  });

  const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: "600",
    color: "#4A5568", marginBottom: "6px",
  };

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px", fontSize: "11.5px", color: "#E53E3E", fontWeight: "500" }}>
        <WarningCircle size={13} weight="fill" color="#E53E3E" />
        {errors[field]}
      </div>
    ) : null;

  // ── Success screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "#DDE6F0", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}>
        <div style={{
          background: "#fff", borderRadius: "18px", border: "1.5px solid #C5D9EE",
          boxShadow: "4px 4px 18px rgba(0,0,0,0.07)",
          padding: "52px 40px", width: "100%", maxWidth: "480px",
          textAlign: "center", boxSizing: "border-box", margin: "0 24px",
        }}>
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
            onClick={() => navigate("/")}
            style={{
              background: "#1D70B8", color: "#fff", border: "none",
              borderRadius: "10px", padding: "11px 36px",
              fontSize: "14px", fontWeight: "600", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(29,112,184,0.3)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#155a94"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#1D70B8"}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Registration form ───────────────────────────────────────────
  return (
    <div style={{
      position:   "fixed",
      top:        0,
      left:       0,
      width:      "100vw",
      height:     "100vh",
      overflowY:  "auto",
      background: "#DDE6F0",
      fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      display:    "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding:    "40px 24px",
      boxSizing:  "border-box",
    }}>
      <div style={{
        background:   "#FFFFFF",
        borderRadius: "18px",
        border:       "1.5px solid #C5D9EE",
        boxShadow:    "4px 4px 18px rgba(0,0,0,0.07)",
        padding:      "36px 40px 40px",
        width:        "100%",
        maxWidth:     "560px",
        boxSizing:    "border-box",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
          <h1 style={{ color: "#1D70B8", fontSize: "26px", fontWeight: "700", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            User Registration
          </h1>
          <div style={{
            width: "84px", height: "84px", borderRadius: "50%",
            background: "#F5E6E0", border: "2.5px solid #C5D9EE",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginTop: "-8px", overflow: "hidden",
          }}>
            <UserIcon size={64} weight="fill" color="#7FB3D5" />
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName}
              onChange={handleChange} style={inputStyle("fullName", !!errors.fullName)}
              onFocus={() => setFocused("fullName")} onBlur={() => setFocused(null)} />
            <ErrorMsg field="fullName" />
          </div>

          {/* Contact Number */}
          <div>
            <label style={labelStyle}>Contact Number</label>
            <input type="tel" name="contactNumber" value={formData.contactNumber}
              onChange={handleChange} style={inputStyle("contactNumber", !!errors.contactNumber)}
              onFocus={() => setFocused("contactNumber")} onBlur={() => setFocused(null)} />
            <ErrorMsg field="contactNumber" />
          </div>

          {/* Location — Search integrated directly into main input bar (Moved above Email) */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <label style={labelStyle}>Location</label>
            
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Select your municipality"
                value={locationOpen ? locationSearch : formData.location || ""}
                onFocus={() => {
                  setFocused("location");
                  setLocationOpen(true);
                  setLocationSearch(formData.location);
                }}
                onBlur={() => setFocused(null)}
                onChange={(e) => {
                  setLocationSearch(e.target.value);
                  if (!locationOpen) setLocationOpen(true);
                }}
                style={{
                  ...inputStyle("location", !!errors.location),
                  paddingRight: "36px",
                  borderBottomLeftRadius: locationOpen ? "0px" : "10px",
                  borderBottomRightRadius: locationOpen ? "0px" : "10px",
                  borderBottomColor: locationOpen ? "#2471A3" : (errors.location ? "#E53E3E" : focused === "location" ? "#2471A3" : "#C5D9EE"),
                }}
              />
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setLocationOpen(v => !v);
                  if(!locationOpen) setLocationSearch(formData.location);
                }}
                style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  display: "flex", alignItems: "center", cursor: "pointer", height: "100%"
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#4A5568" strokeWidth="2.5" style={{
                    transform: locationOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s"
                  }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            <ErrorMsg field="location" />

            {/* Dropdown options container */}
            {locationOpen && (
              <div style={{
                position: "absolute", 
                top: "100%", 
                left: 0, 
                right: 0,
                background: "#fff", 
                border: "1.5px solid #2471A3",
                borderTop: "none", 
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px", 
                zIndex: 300,
                boxShadow: "0 6px 20px rgba(0,0,0,0.12)", 
                overflow: "hidden",
              }}>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {filteredMunicipalities.length === 0 ? (
                    <div style={{ padding: "12px 14px", fontSize: "13px", color: "#9BB8D0", textAlign: "center" }}>
                      No results found
                    </div>
                  ) : (
                    filteredMunicipalities.map((m) => (
                      <div
                        key={m}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFormData(prev => ({ ...prev, location: m }));
                          setLocationSearch(m);
                          setLocationOpen(false);
                          if (errors.location) setErrors(er => ({ ...er, location: "" }));
                        }}
                        style={{
                          padding: "10px 14px", fontSize: "13px", cursor: "pointer",
                          color:      formData.location === m ? "#2471A3" : "#2d3a52",
                          background: formData.location === m ? "#E8F1FB" : "#fff",
                          fontWeight: formData.location === m ? 600 : 400,
                          borderBottom: "1px solid #F7F9FC",
                        }}
                        onMouseEnter={(e) => { if (formData.location !== m) e.currentTarget.style.background = "#F7F9FC"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = formData.location === m ? "#E8F1FB" : "#fff"; }}
                      >
                        {m}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="emailAddress" value={formData.emailAddress}
              onChange={handleChange} style={inputStyle("emailAddress", !!errors.emailAddress)}
              onFocus={() => setFocused("emailAddress")} onBlur={() => setFocused(null)} />
            <ErrorMsg field="emailAddress" />
          </div>

          {/* Password + Confirm Password */}
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={formData.password}
                onChange={handleChange} style={inputStyle("password", !!errors.password)}
                onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
              <ErrorMsg field="password" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} style={inputStyle("confirmPassword", !!errors.confirmPassword)}
                onFocus={() => setFocused("confirmPassword")} onBlur={() => setFocused(null)} />
              <ErrorMsg field="confirmPassword" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "28px", gap: "10px" }}>
          {apiError && (
            <div style={{ fontSize: "13px", color: "#E53E3E", textAlign: "center" }}>{apiError}</div>
          )}
          <button
            onClick={handleSubmit}
            style={{
              background: "#1D70B8", color: "#FFFFFF", border: "none",
              borderRadius: "10px", padding: "12px 44px", fontSize: "15px",
              fontWeight: "600", letterSpacing: "0.02em", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(29,112,184,0.3)", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#155a94"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#1D70B8"}
          >
            {loading ? "Registering..." : "Register as User"}
          </button>
        </div>

      </div>
    </div>
  );
}