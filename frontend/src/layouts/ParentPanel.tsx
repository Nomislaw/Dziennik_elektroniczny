import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Uzytkownik } from "../types/Uzytkownik";
import { pobierzRodzicaById } from "../api/UzytkownikService";
import HomeParent from "../pages/parent/HomeParent";
import PlanLekcji from "../pages/student/PlanLekcji";
import Oceny from "../pages/student/Oceny";
import Frekwencja from "../pages/student/Frekwencja";
import Settings from "../pages/Settings";
import { ChatPage } from "../pages/ChatPage";

export interface UczenSimpleDto {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  klasaNazwa: string | null;
  klasaId: number | null;
}

export interface RodzicDto {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  czyEmailPotwierdzony: boolean;
  dzieci: UczenSimpleDto[];
}

export default function RodzicPanel() {
  const navigate = useNavigate();
  const [rodzic, setRodzic] = useState<RodzicDto | null>(null);
  const [selectedUczenId, setSelectedUczenId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("homeparent");

  useEffect(() => {
    const loadRodzic = async () => {
      const u = localStorage.getItem("user");
      if (!u) return navigate("/login");
      
      const userData = JSON.parse(u) as Uzytkownik;
      try {
        const rodzicData = await pobierzRodzicaById(userData.id);
        setRodzic(rodzicData);
        
        if (rodzicData?.dzieci?.length > 0) {
          setSelectedUczenId(rodzicData.dzieci[0].id);
        }
      } catch (error) {
        console.error("Błąd pobierania danych rodzica:", error);
        navigate("/login");
      }
    };
    loadRodzic();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!rodzic) return <div>Ładowanie danych rodzica...</div>;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-green-700 text-white flex flex-col shrink-0">
        <div className="p-4 text-2xl font-bold border-b border-green-600 shrink-0">
          👨‍👩‍👧‍👦 Panel Rodzica
        </div>

        {/* Górne przyciski */}
        <div className="p-4 border-b border-green-600 shrink-0">
          <button
            onClick={() => setActiveTab("homeparent")}
            className={`mb-2 w-full text-left px-4 py-2 rounded-lg hover:bg-green-600 ${
              activeTab === "homeparent" ? "bg-green-600" : ""
            }`}
          >
            🏠 Strona główna rodzica
          </button>
          <button
            onClick={() => setActiveTab("message")}
            className={`mb-2 w-full text-left px-4 py-2 rounded-lg hover:bg-green-600 ${
              activeTab === "message" ? "bg-green-600" : ""
            }`}
          >
            ✉️ Wiadomości
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-green-600 ${
              activeTab === "settings" ? "bg-green-600" : ""
            }`}
          >
            ⚙️ Ustawienia
          </button>
        </div>

        {/* Nawigacja z wyborem ucznia */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <label className="block text-sm font-semibold mb-2 text-green-100">
            Wybierz ucznia:
          </label>
          <select
            value={selectedUczenId?.toString() || ""}
            onChange={(e) => setSelectedUczenId(e.target.value ? Number(e.target.value) : null)}
            className="w-full p-2 rounded-lg bg-green-600 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
           
            {rodzic.dzieci.map((uczen) => (
              <option key={uczen.id} value={uczen.id.toString()}>
                {uczen.imie} {uczen.nazwisko} ({uczen.klasaNazwa || 'Brak klasy'})
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setActiveTab("plan")}
            className={`mt-4 w-full text-left px-4 py-2 rounded-lg hover:bg-green-600 ${
              activeTab === "plan" ? "bg-green-600" : ""
            } ${!selectedUczenId ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedUczenId}
          >
            📅 Plan lekcji
          </button>
          <button
            onClick={() => setActiveTab("oceny")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-green-600 ${
              activeTab === "oceny" ? "bg-green-600" : ""
            } ${!selectedUczenId ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedUczenId}
          >
            🧮 Oceny
          </button>
          <button
            onClick={() => setActiveTab("frekwencja")}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-green-600 ${
              activeTab === "frekwencja" ? "bg-green-600" : ""
            } ${!selectedUczenId ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedUczenId}
          >
            👥 Frekwencja
          </button>
        </nav>

        {/* Stopka */}
        <div className="p-4 border-t border-green-600 shrink-0">
          <p className="font-semibold">{rodzic.imie} {rodzic.nazwisko}</p>
          <p className="text-green-200">{rodzic.email}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg bg-green-800 hover:bg-green-600 mt-4"
          >
            🚪 Wyloguj się
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {activeTab === "message" ? (
            <div className="h-full w-full overflow-hidden">
              <ChatPage />
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              {activeTab === "homeparent" && <HomeParent rodzic={rodzic} />}
              {activeTab === "plan" && selectedUczenId && <PlanLekcji uczenId={selectedUczenId} />}
              {activeTab === "oceny" && selectedUczenId && <Oceny uczenId={selectedUczenId} />}
              {activeTab === "frekwencja" && selectedUczenId && <Frekwencja uczenId={selectedUczenId} />}
              {activeTab === "settings" && <Settings />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
