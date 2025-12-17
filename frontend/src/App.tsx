// App.tsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import VerifyEmail from "./components/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";

import StudentPanel from "./layouts/StudentPanel";
import TeacherPanel from "./layouts/TeacherPanel";
import AdminPanel from "./layouts/AdminPanel";

import Home from "./pages/student/Home";
import PlanLekcji from "./pages/student/PlanLekcji";
import Oceny from "./pages/student/Oceny";
import Settings from "./pages/Settings";

function Navigation() {
  const location = useLocation();
  const userData = localStorage.getItem("user");

  if (
    userData ||
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/teacher") ||
    location.pathname === "/settings"
  ) {
    return null;
  }

  return (
    <nav className="flex justify-center gap-4 p-4 bg-blue-200">
      <Link to="/login">Logowanie</Link>
      <Link to="/register">Rejestracja</Link>
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

        {/* Uczen */}
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
