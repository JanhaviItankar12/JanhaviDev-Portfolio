import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./component/MainLayout"; // Your public portfolio
import Signup from "./Admin/Auth/Signup";
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark-100)' }}>
        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<MainLayout />} />

           {/* Admin Panel */}

          <Route path="/admin/signup" element={<Signup/>} />
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;