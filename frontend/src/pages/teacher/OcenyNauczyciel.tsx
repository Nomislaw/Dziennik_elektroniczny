export default function OcenyNauczyciel() {
  const uczniowie = [
    { id: 1, imie: "Jan", nazwisko: "Kowalski" },
    { id: 2, imie: "Anna", nazwisko: "Nowak" },
    { id: 3, imie: "Kacper", nazwisko: "Wiśniewski" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🧮 Wystawianie ocen</h2>

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Uczeń</th>
              <th className="p-2 border">Nowa ocena</th>
              <th className="p-2 border">Akcja</th>
            </tr>
          </thead>

          <tbody>
            {uczniowie.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.imie} {u.nazwisko}</td>
                <td className="border p-2">
                  <input
                    className="border p-1 rounded w-20 text-center"
                    type="number"
                    min="1"
                    max="6"
                    placeholder="5"
                  />
                </td>
                <td className="border p-2">
                  <button className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">
                    Dodaj ocenę
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
