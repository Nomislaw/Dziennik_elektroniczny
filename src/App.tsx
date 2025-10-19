import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  return (
    <Router>
      <nav className="flex justify-center gap-4 p-4 bg-blue-200">
        <Link to="/login">🔑 Logowanie</Link>
        <Link to="/register">🧾 Rejestracja</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
