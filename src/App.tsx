import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      {!isLoggedIn && (
        <nav className="flex justify-center gap-4 p-4 bg-blue-200">
          <Link to="/login">🔑 Logowanie</Link>
          <Link to="/register">🧾 Rejestracja</Link>
        </nav>
      )}

      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={<Home onLogout={() => setIsLoggedIn(false)} />}
        />
      </Routes>
    </Router>
  );
}
