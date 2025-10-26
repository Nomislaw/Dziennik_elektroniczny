import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-blue-600">
          🏫 Dziennik
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600">🏠 Strona główna</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600">📅 Plan lekcji</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600">🧮 Oceny</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600">📘 Przedmioty</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600">✉️ Wiadomości</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600">⚙️ Ustawienia</button>
        </nav>
        <div className="p-4 border-t border-blue-600">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-600">
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
            <span className="text-gray-700 font-medium">Jan Kowalski</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profil"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
export {};
