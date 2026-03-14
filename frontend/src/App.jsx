import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./component/MainLayout"; // Your public portfolio
import Signup from "./Admin/Auth/Signup";
import Login from "./Admin/Auth/Login";
import Protect from "./Admin/Auth/Protect";
import Dashboard from "./Admin/Dashboard/Dashboard";

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
          <Route path="/admin/login" element={<Login/>} />
          <Route path="/admin/dashboard" element={
            <Protect>
              <Dashboard/>
            </Protect>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;