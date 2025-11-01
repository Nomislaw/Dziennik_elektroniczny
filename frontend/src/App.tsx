import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./layouts/Dashboard";
import VerifyEmail from "./components/VerifyEmail";

function Navigation() {
  const location = useLocation();

  if (location.pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav className="flex justify-center gap-4 p-4 bg-blue-200">
      <Link to="/login">🔑 Logowanie</Link>
      <Link to="/register">🧾 Rejestracja</Link>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <Navigation />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard children/>} />
        <Route path="/verify" element={<VerifyEmail  />} />
      </Routes>
    </Router>
  );
}
