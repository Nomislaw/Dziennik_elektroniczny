import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Uzytkownik } from "../types/Uzytkownik";
import OcenyNauczyciel from "../pages/teacher/OcenyNauczyciel";
import FrekwencjaNauczyciel from "../pages/teacher/FrekwencjaNauczyciel";
import Settings from "../pages/Settings"; 
import { ChatPage } from "../pages/ChatPage";

export default function TeacherPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Uzytkownik | null>(null);
  const [activeTab, setActiveTab] = useState("oceny");

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

  if (!user) return <div>Ładowanie...</div>;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-700 text-white flex flex-col shrink-0">
        <div className="p-4 text-2xl font-bold border-b border-purple-600 shrink-0">
          🧑‍🏫 Panel nauczyciela
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab("oceny")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-purple-600 ${
              activeTab === "oceny" ? "bg-purple-600" : ""
            }`}
          >
            🧮 Wystawianie ocen
          </button>
          <button
            onClick={() => setActiveTab("frekwencja")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-purple-600 ${
              activeTab === "frekwencja" ? "bg-purple-600" : ""
            }`}
          >
            📊 Frekwencja
          </button>
          <button
            onClick={() => setActiveTab("message")} 
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-purple-600 ${
              activeTab === "message" ? "bg-purple-600" : "" 
            }`}
          >
            ✉️ Wiadomości
          </button>
          <button
            onClick={() => setActiveTab("settings")} 
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-purple-600 ${
              activeTab === "settings" ? "bg-purple-600" : "" 
            }`}
          >
            ⚙️ Ustawienia
          </button>
        </nav>
        <div className="p-4 border-t border-purple-600 shrink-0">
          <p className="font-semibold">{user.imie} {user.nazwisko}</p>
          <p className="text-purple-200">{user.email}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg bg-purple-800 hover:bg-purple-600 mt-4"
          >
            🚪 Wyloguj się
          </button>
        </div>
      </aside>

      {/* Main content - POPRAWIONY */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {activeTab === "message" ? (
            <div className="h-full w-full overflow-hidden">
              <ChatPage />
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              {activeTab === "oceny" && <OcenyNauczyciel nauczyciel={user} />}
              {activeTab === "frekwencja" && <FrekwencjaNauczyciel nauczycielId={user.id} />}
              {activeTab === "settings" && <Settings />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
