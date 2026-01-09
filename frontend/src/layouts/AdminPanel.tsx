import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Uzytkownik } from "../types/Uzytkownik";
import UczniowieList from "../pages/admin/UcznioweList";
import NauczycieleList from "../pages/admin/NauczycielList";
import RodziceList from "../pages/admin/RodziceList";
import AdministratorzyList from "../pages/admin/AdministratorList";
import SaleList from "../pages/admin/SaleList";
import PrzedmiotList from "../pages/admin/PrzedmiotList";
import Settings from "../pages/Settings"; 
import KlasyList from "../pages/admin/KlasyList";
import ZajeciaList from "../pages/admin/ZajeciaList";
import PlanList from "../pages/admin/PlanList";
import SemestrList from "../pages/admin/SemestrList";
import { ChatPage } from "../pages/ChatPage";

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
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col shrink-0">
        <div className="p-4 text-2xl font-bold border-b border-teal-600 shrink-0">
          🏫 Panel Admina
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
            onClick={() => setActiveTab("sale")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "sale" ? "bg-teal-600" : ""
            }`}
          >
            🏫 Sale
          </button>
          <button
            onClick={() => setActiveTab("przedmioty")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "przedmioty" ? "bg-teal-600" : ""
            }`}
          >
            📚 Przedmioty
          </button>
          <button
            onClick={() => setActiveTab("klasy")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "klasy" ? "bg-teal-600" : ""
            }`}
          >
            🏫 Klasy
          </button>
          <button
            onClick={() => setActiveTab("semestry")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "semestry" ? "bg-teal-600" : ""
            }`}
          >
            📆 Semestry
          </button>
          <button
            onClick={() => setActiveTab("plan")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "plan" ? "bg-teal-600" : ""
            }`}
          >
            🗓️ Plany
          </button>
          <button
            onClick={() => setActiveTab("zajecia")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "zajecia" ? "bg-teal-600" : ""
            }`}
          >
            🧑‍🏫 Zajęcia
          </button>
          <button
            onClick={() => setActiveTab("message")} 
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "message" ? "bg-teal-600" : ""
            }`}
          >
            ✉️ Wiadomości
          </button>
          <button
            onClick={() => setActiveTab("settings")} 
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-teal-600 ${
              activeTab === "settings" ? "bg-teal-600" : ""
            }`}
          >
            ⚙️ Ustawienia
          </button>
        </nav>
        <div className="p-4 border-t border-teal-600 shrink-0">
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

      {/* Main content - BEZ PADDINUGU DLA CHATU */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow shrink-0 p-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {activeTab === "uczniowie" && "Zarządzanie uczniami"}
            {activeTab === "nauczyciele" && "Zarządzanie nauczycielami"}
            {activeTab === "rodzice" && "Zarządzanie rodzicami"}
            {activeTab === "administratorzy" && "Zarządzanie administratorami"}
            {activeTab === "sale" && "Zarządzanie salami"}
            {activeTab === "klasy" && "Zarządzanie klasami"}
            {activeTab === "przedmioty" && "Zarządzanie przedmiotami"}
            {activeTab === "zajecia" && "Zarządzanie zajęciami"}
            {activeTab === "plan" && "Zarządzanie planami"}
            {activeTab === "semestry" && "Zarządzanie semestrami"}
            {activeTab === "message" && "Wiadomości"}
            {activeTab === "settings" && "Ustawienia"}
          </h1>
        </header>

        {/* Content BEZ p-6 dla ChatPage */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "message" ? (
            <div className="h-full w-full overflow-hidden">
              <ChatPage />
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              {activeTab === "uczniowie" && <UczniowieList />}
              {activeTab === "nauczyciele" && <NauczycieleList />}
              {activeTab === "rodzice" && <RodziceList />}
              {activeTab === "administratorzy" && <AdministratorzyList />}
              {activeTab === "sale" && <SaleList />}
              {activeTab === "przedmioty" && <PrzedmiotList />}
              {activeTab === "klasy" && <KlasyList />}
              {activeTab === "settings" && <Settings />}
              {activeTab === "zajecia" && <ZajeciaList />}
              {activeTab === "plan" && <PlanList />}
              {activeTab === "semestry" && <SemestrList />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
