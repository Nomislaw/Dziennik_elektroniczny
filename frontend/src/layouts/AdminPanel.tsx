import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Uzytkownik } from "../types/Uzytkownik";
import UczniowieList from "../pages/admin/UcznioweList";
import NauczycieleList from "../pages/admin/NauczycielList";
import RodziceList from "../pages/admin/RodziceList";
import AdministratorzyList from "../pages/admin/AdministratorList";
//import AdministratorzyList from "../pages/admin/AdministratorzyList";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Uzytkownik | null>(null);
  const [activeTab, setActiveTab] = useState("uczniowie");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div>Ładowanie...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-teal-600">
          🏫 Panel Admina
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("uczniowie")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "uczniowie" ? "bg-teal-600" : ""
            }`}
          >
            👨‍🎓 Uczniowie
          </button>
          <button
            onClick={() => setActiveTab("nauczyciele")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "nauczyciele" ? "bg-teal-600" : ""
            }`}
          >
            👨‍🏫 Nauczyciele
          </button>
          <button
            onClick={() => setActiveTab("rodzice")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "rodzice" ? "bg-teal-600" : ""
            }`}
          >
            👪 Rodzice
          </button>
          <button
            onClick={() => setActiveTab("administratorzy")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "administratorzy" ? "bg-teal-600" : ""
            }`}
          >
            🔐 Administratorzy
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600"
          >
            ⚙️ Ustawienia
          </button>
        </nav>
        <div className="p-4 border-t border-teal-600">
          <div className="mb-2 text-sm">
            <p className="font-semibold">{user.imie} {user.nazwisko}</p>
            <p className="text-teal-200">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg bg-teal-800 hover:bg-teal-600"
          >
            🚪 Wyloguj się
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow p-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {activeTab === "uczniowie" && "Zarządzanie uczniami"}
            {activeTab === "nauczyciele" && "Zarządzanie nauczycielami"}
            {activeTab === "rodzice" && "Zarządzanie rodzicami"}
            {activeTab === "administratorzy" && "Zarządzanie administratorami"}
          </h1>
        </header>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "uczniowie" && <UczniowieList />}
          {activeTab === "nauczyciele" && <NauczycieleList />}
          {activeTab === "rodzice" && <RodziceList />}
          {activeTab === "administratorzy" && <AdministratorzyList />}
        </div>
      </main>
    </div>
  );
}