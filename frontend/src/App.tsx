// App.tsx

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
// Importy nowych/zmienionych layoutów
import StudentPanel from "./layouts/StudentPanel"; // Zmieniony import
// import Dashboard from "./layouts/Dashboard"; // Możesz usunąć Dashboard
import VerifyEmail from "./components/VerifyEmail";
import Settings from "./pages/Settings";
import AdminPanel from "./layouts/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import PlanLekcji from "./pages/PlanLekcji";
import Oceny from "./pages/Oceny";
import Home from "./pages/Home"; // Dodaj import Home, jeśli to Twoja główna strona panelu
import TeacherPanel from "./layouts/TeacherPanel";


function Navigation() {
  const location = useLocation();
  const userData = localStorage.getItem("user");

  if (
    userData ||
    location.pathname.startsWith("/student") || 
    location.pathname === "/settings" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/teacher")
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
{/* Uczeń */}
       <Route
  path="/student"
  element={
    <ProtectedRoute allowedRoles={["Uczen"]}>
      <StudentPanel />
    </ProtectedRoute>
  }
>
  <Route index element={<Home />} />
  <Route path="plan" element={<PlanLekcji />} />
  <Route path="oceny" element={<Oceny />} />
  <Route path="settings" element={<Settings />} /> 
</Route>


{/* Administrator */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
        <Route path="settings" element={<Settings />} /> 
        </Route>

        {/* Nauczyciel */}
<Route
  path="/teacher"
  element={
    <ProtectedRoute allowedRoles={["Nauczyciel"]}>
      <TeacherPanel />
    </ProtectedRoute>
  }
>
        <Route path="settings" element={<Settings />} /> 
</Route>

      </Routes>
    </Router>
  );
}