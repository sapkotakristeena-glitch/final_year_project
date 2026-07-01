import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Complaint_Submission from "./pages/Complaint_Submission";
import Admin_Panel from "./pages/Admin_Panel";
import Admin_Complaints from "./pages/Admin_Complaints";
import UserRegistrationForm from "./pages/UserRegistrationForm";
import MyComplaints from "./pages/MyComplaints";
import UserDashboard from "./pages/UserDashboard";
import Login from "./pages/Login";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [complaints, setComplaints] = useState([]);

  const addComplaint = (newComplaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/"             element={<Login />} />
        <Route path="/registration" element={<UserRegistrationForm />} />
        <Route path="/submit"       element={<ProtectedRoute><Complaint_Submission /></ProtectedRoute>} />
        <Route path="/mycomplaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
        <Route path="/admin"        element={<ProtectedRoute><Admin_Panel /></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute><Admin_Complaints /></ProtectedRoute>} />
        <Route path="/user"         element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;