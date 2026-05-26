import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Complaint_Submission from "./pages/Complaint_Submission";
import Admin_Panel from "./pages/Admin_Panel"; 
import UserRegistrationForm from "./pages/UserRegistrationForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Using the name from the Line 2 import */}
        <Route path="/" element={<Complaint_Submission />} /> 

        {/* Using the name from the Line 3 import */}
        <Route path="/admin" element={<Admin_Panel />} />

        <Route path="/registration" element={<UserRegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;