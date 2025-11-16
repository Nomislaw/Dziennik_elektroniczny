import { useState } from "react";
import UsersList from "../pages/admin/UserList";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("home"); // domyślnie strona główna

  return (
    <div className="flex h-screen">

      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Panel administratora</h1>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className="text-left p-2 hover:bg-gray-700 rounded"
          >
            🏠 Strona główna
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className="text-left p-2 hover:bg-gray-700 rounded"
          >
            👥 Użytkownicy
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className="text-left p-2 hover:bg-gray-700 rounded"
          >
            ⚙️ Ustawienia
          </button>
        </nav>
      </div>

      {/* --- CONTENT --- */}
      <div className="flex-1 bg-gray-100 p-6">

        {activeTab === "home" && (
          <h2 className="text-2xl font-bold">Witaj w panelu administratora!</h2>
        )}

        {activeTab === "users" && <UsersList />}

        {activeTab === "settings" && <p>Panel ustawień…</p>}
        
      </div>
    </div>
  );
}
