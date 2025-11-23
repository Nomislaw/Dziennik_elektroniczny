import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./layouts/Dashboard";
import VerifyEmail from "./components/VerifyEmail";
import Settings from "./pages/Settings";
import AdminPanel from "./layouts/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import PlanLekcji from "./pages/PlanLekcji";
import Oceny from "./pages/Oceny";
import TeacherPanel from "./layouts/TeacherPanel";



function Navigation() {
  const location = useLocation();
  const userData = localStorage.getItem("user");

  if (
    userData ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname === "/settings" ||
    location.pathname.startsWith("/admin")
  ) {
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
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/settings" element={<Settings />} />

        {/* Uczeń */}
       <Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={["Uczen"]}>
      <Dashboard />
    </ProtectedRoute>
  }
>
  <Route path="plan" element={<PlanLekcji />} />
  <Route path="oceny" element={<Oceny />} />
</Route>


        {/* Administrator */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Nauczyciel */}
<Route
  path="/teacher"
  element={
    <ProtectedRoute allowedRoles={["Nauczyciel"]}>
      <TeacherPanel />
    </ProtectedRoute>
  }
/>

      </Routes>
    </Router>
  );
}
