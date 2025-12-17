import React from "react";
import OcenaItem from "../../components/OcenaItem";

export default function OcenyView() {
  const przedmioty = [
    { nazwa: "Matematyka", oceny: [5, 4, 3, 5] },
    { nazwa: "Język polski", oceny: [4, 5, 4] },
    { nazwa: "Historia", oceny: [3, 3, 4] }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">📝 Oceny uczniów</h1>

      {przedmioty.map((p, idx) => (
        <div key={idx} className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{p.nazwa}</h2>

          <div className="flex gap-3">
            {p.oceny.map((o, i) => (
              <OcenaItem key={i} ocena={o} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
