import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Uzytkownik } from "../types/Uzytkownik";

import Home from "../pages/student/Home";
import PlanLekcji from "../pages/student/PlanLekcji";
import Oceny from "../pages/student/Oceny";
import Settings from "../pages/Settings";
import Frekwencja from "../pages/student/Frekwencja";

export default function StudentPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Uzytkownik | null>(null);
  const [activeTab, setActiveTab] = useState("home"); // domyślnie strona główna

  // Pobranie danych użytkownika
  useEffect(() => {
    const loadUser = async () => {
      const u = localStorage.getItem("user");
      if (!u) return navigate("/login");
      setUser(JSON.parse(u));
    };
    loadUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div>Ładowanie danych użytkownika...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-blue-600">
          🏫 Panel Ucznia
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600 ${
              activeTab === "home" ? "bg-blue-600" : ""
            }`}
          >
            🏠 Strona główna
          </button>

          <button
            onClick={() => setActiveTab("plan")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600 ${
              activeTab === "plan" ? "bg-blue-600" : ""
            }`}
          >
            📅 Plan lekcji
          </button>

          <button
            onClick={() => setActiveTab("oceny")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600 ${
              activeTab === "oceny" ? "bg-blue-600" : ""
            }`}
          >
            🧮 Oceny
          </button>

          <button
            onClick={() => setActiveTab("frekwencja")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600 ${
              activeTab === "frekwencja" ? "bg-blue-600" : ""
            }`}
          >
            👥 Frekwencja
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600 ${
              activeTab === "settings" ? "bg-blue-600" : ""
            }`}
          >
            ⚙️ Ustawienia
          </button>
        </nav>

        <div className="p-4 border-t border-blue-600">
          <p className="font-semibold">
            {user.imie} {user.nazwisko}
          </p>
          <p className="text-blue-200">{user.email}</p>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-600 mt-4"
          >
            🚪 Wyloguj się
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "home" && <Home  uczenId={user.id} />}
        {activeTab === "plan" && <PlanLekcji uczenId={user.id} />}
        {activeTab === "oceny" && <Oceny uczenId={user.id} />}
        {activeTab === "frekwencja" && <Frekwencja uczenId={user.id} />}
        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
}
