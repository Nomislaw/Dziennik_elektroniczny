import React, { useState } from "react";

const dni = ["Pon", "Wt", "Śr", "Czw", "Pt"];

// ⬇⬇⬇ PLACEHOLDERY — backend wstawi tu swoje dane z API
// Przykładowa struktura, jak backend powinien zwracać plan:
const placeholderPlan = [
  {
    id: 1,
    dzien: "Pon",
    godzina: "8:00",
    przedmiot: "Matematyka",
    nauczyciel: "tu imię nauczyciela",
    sala: "tu sala",
    opis: "tu dodatkowy opis np. temat lekcji",
  },
  {
    id: 2,
    dzien: "Pon",
    godzina: "9:00",
    przedmiot: "Historia",
    nauczyciel: "tu imię nauczyciela",
    sala: "tu sala",
    opis: "tu dodatkowy opis",
  },
  {
    id: 3,
    dzien: "Wt",
    godzina: "10:00",
    przedmiot: "Fizyka",
    nauczyciel: "tu imię nauczyciela",
    sala: "tu sala",
    opis: "tu dodatkowy opis",
  },
];
///////////////////////////////////////////////////////////////

const godziny = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
];

export default function Schedule() {
  const [hovered, setHovered] = useState<any>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX + 15, y: e.clientY + 15 }); // tooltip obok kursora
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Plan lekcji</h2>

      <div className="grid"
           style={{
             gridTemplateColumns: `100px repeat(${dni.length}, 1fr)`,
           }}>

        {/* Nagłówki dni tygodnia */}
        <div></div>
        {dni.map((d) => (
          <div key={d} className="font-semibold text-center py-2 border-b">
            {d}
          </div>
        ))}

        {/* Reszta planu */}
        {godziny.map((godzina) => (
          <React.Fragment key={godzina}>
            {/* godzina po lewej */}
            <div className="border-r py-6 px-2 text-sm text-gray-600">
              {godzina}
            </div>

            {/* pola na lekcje */}
            {dni.map((dzien) => {
              const lekcja = placeholderPlan.find(
                (l) => l.dzien === dzien && l.godzina === godzina
              );

              return (
                <div
                  key={dzien + godzina}
                  onMouseEnter={() => setHovered(lekcja)}
                  onMouseLeave={() => setHovered(null)}
                  onMouseMove={handleMouseMove}
                  className="border h-16 relative flex items-center justify-center"
                >
                  {lekcja && (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-sm cursor-pointer">
                      {lekcja.przedmiot}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            position: "fixed",
            top: cursorPos.y,
            left: cursorPos.x,
            background: "white",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "6px",
            width: "220px",
            zIndex: 999,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            pointerEvents: "none",
          }}
        >
          <div><strong>{hovered.przedmiot}</strong></div>
          <div>Nauczyciel: {hovered.nauczyciel}</div>
          <div>Sala: {hovered.sala}</div>
          <div>Opis: {hovered.opis}</div>

          {/* KOMENTARZ DLA BACKENDU:
              to wszystko (nauczyciel, sala, opis) powinno przyjść z API.
              Struktura rekordów znajduje się na początku pliku. */}
        </div>
      )}
    </div>
  );
}
