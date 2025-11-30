// pages/Home.tsx (lub /dashboard/Home.tsx, w zależności gdzie go trzymasz)

import { useNavigate } from "react-router-dom";
// Usunąłem HomeProps, ponieważ wylogowanie obsługuje teraz StudentPanel

export default function Home() {
  // Nie potrzebujemy już navigate w tym miejscu, ani onLogout, 
  // ponieważ te funkcjonalności przeniesione zostały do layoutu StudentPanel.
  // To jest teraz tylko strona powitalna.

  return (
    <div className="flex flex-col min-h-full bg-white rounded-xl shadow-lg p-8">
      
      {/* 🔹 Nagłówek i powitanie */}
      <h2 className="text-4xl font-extrabold text-blue-800 mb-4">
        🎉 Witaj, Jan Kowalski!
      </h2>
      <p className="text-gray-600 mb-8 text-xl">
        Jesteś w swoim elektronicznym dzienniku. Wybierz opcję z menu bocznego, aby zobaczyć szczegóły.
      </p>

      {/* 🔹 Sekcje główne */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {[
          { title: "📰 Ostatnie Oceny", content: "Sprawdź swoje najnowsze wyniki z zajęć." },
          { title: "📅 Najbliższe Lekcje", content: "Zobacz, co masz w planie na jutro." },
          { title: "✉️ Oczekujące Wiadomości", content: "Masz 2 nowe wiadomości od wychowawcy." },
          { title: "📚 Nowe Wydarzenia Szkolne", content: "Nadchodzą Dni Otwarte! Sprawdź szczegóły." },
        ].map((section) => (
          <div
            key={section.title}
            className="bg-blue-50 hover:bg-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold mb-2 text-blue-900">{section.title}</h3>
            <p className="text-gray-700">{section.content}</p>
          </div>
        ))}
      </div>

    </div>
  );
}