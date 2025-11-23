import { ReactNode, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Outlet bardzo ważny
import { Uzytkownik } from "../types/Uzytkownik";
//import Schedule from "../components/Schedule";



interface DashboardLayoutProps {
  children?: React.ReactNode; // zmiana z required na optional
}



export default function Dashboard({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<Uzytkownik | null>(null);

  // Pobranie danych użytkownika po zalogowaniu
  useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsed = JSON.parse(userData);
    setUser(parsed);

    
  } else {
    navigate("/login");
  }
}, [navigate]);


  // Obsługa wylogowania
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-blue-600">
          🏫 Dziennik
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
  onClick={() => navigate("/dashboard")}
  className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600"
>
  🏠 Strona główna
</button>

<button
  onClick={() => navigate("/dashboard/plan")}
  className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600"
>
  📅 Plan lekcji
</button>

<button
  onClick={() => navigate("/dashboard/oceny")}
  className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600"
>
  🧮 Oceny
</button>

          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600">
            ✉️ Wiadomości
          </button>
          <button
          onClick={() => navigate("/settings")}
          className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600"
          >
          ⚙️ Ustawienia
        </button>
        </nav>
        <div className="p-4 border-t border-blue-600">
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
            <span className="text-gray-700 font-medium">
              {user ? `${user.imie} ${user.nazwisko}` : "Ładowanie..."}
            </span>
            
          </div>
        </header>

        {/* Page content */}
       <div className="p-6 overflow-y-auto">
        <Outlet /> {/* Tutaj wczytują się podstrony jak Settings */}
         {children}
        </div>
      </main>
    </div>
  );
}
