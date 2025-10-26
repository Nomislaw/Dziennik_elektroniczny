import { useNavigate } from "react-router-dom";

interface HomeProps {
  onLogout: () => void;
}

export default function Home({ onLogout }: HomeProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🔹 Główny nagłówek */}
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">📘 Panel ucznia</h1>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">Jan Kowalski</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
          >
            Wyloguj
          </button>
        </div>
      </header>

      {/* 🔹 Główna sekcja: menu + treść */}
      <div className="flex flex-1">
        {/* Lewy panel - menu */}
        <aside className="w-72 bg-blue-100 p-6 flex flex-col gap-4 border-r border-blue-200">
          {[
            { label: "🏫 Plan lekcji" },
            { label: "🧮 Oceny" },
            { label: "🧑‍🏫 Nauczyciele" },
            { label: "📄 Wiadomości" },
          ].map((item) => (
            <button
              key={item.label}
              className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold rounded-xl py-3 shadow-sm transition-transform transform hover:scale-105"
            >
              {item.label}
            </button>
          ))}
        </aside>

        {/* Prawa strona - zawartość */}
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-6">Witaj w dzienniku elektronicznym</h2>
          <p className="text-gray-600 mb-8">Wybierz jedną z opcji z menu po lewej stronie.</p>

          {/* 🔹 Sekcje główne */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "📰 Aktualności" },
              { title: "📚 Przedmioty" },
              { title: "🧑‍🏫 Nauczyciele" },
              { title: "📅 Wydarzenia" },
            ].map((section) => (
              <div
                key={section.title}
                className="bg-blue-100 hover:bg-blue-200 p-6 rounded-2xl shadow-sm transition-transform transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-900">{section.title}</h3>
                <p className="text-gray-600">Tutaj pojawi się treść dodana przez administratora.</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* 🔹 Stopka */}
      <footer className="bg-blue-500 text-white text-center p-4 mt-auto">
        <p>📍 Zespół Szkół nr 1 w Warszawie</p>
        <p>📞 Kontakt: <a href="mailto:kontakt@szkola.pl" className="underline">kontakt@szkola.pl</a></p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-blue-200">🌐 Facebook</a>
          <a href="#" className="hover:text-blue-200">🐦 Twitter</a>
          <a href="#" className="hover:text-blue-200">📸 Instagram</a>
        </div>
      </footer>
    </div>
  );
}
