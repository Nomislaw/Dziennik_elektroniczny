// layouts/StudentPanel.tsx

import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Uzytkownik } from "../types/Uzytkownik";

export default function StudentPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Uzytkownik | null>(null);

  // Pobranie danych użytkownika po zalogowaniu
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    } else {
      // Przekierowanie na stronę logowania, jeśli nie ma danych użytkownika
      navigate("/login");
    }
  }, [navigate]);

  // Obsługa wylogowania
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <div>Ładowanie danych użytkownika...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-blue-600">
          🏫 Dziennik Ucznia
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* Menu nawigacyjne ucznia */}
          <button
            onClick={() => navigate("/student")} 
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            🏠 Strona główna
          </button>

          <button
            onClick={() => navigate("/student/plan")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            📅 Plan lekcji
          </button>

          <button
            onClick={() => navigate("/student/oceny")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            🧮 Oceny
          </button>

          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600">
            ✉️ Wiadomości
          </button>
          
          <button
            onClick={() => navigate("/student/settings")} 
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            ⚙️ Ustawienia
          </button>
        </nav>
        <div className="p-4 border-t border-blue-600">
          {/* Informacje o użytkowniku i wylogowanie */}
          <div className="mb-2 text-sm">
            <p className="font-semibold">{user.imie} {user.nazwisko}</p>
            <p className="text-blue-200">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-600"
          >
            🚪 Wyloguj się
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Panel ucznia</h1>
          <div className="flex items-center space-x-3">
            
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 overflow-y-auto flex-1">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}