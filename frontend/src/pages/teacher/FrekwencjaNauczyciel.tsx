export default function FrekwencjaNauczyciel() {
  const uczniowie = [
    { id: 1, imie: "Jan", nazwisko: "Kowalski", obecny: true },
    { id: 2, imie: "Anna", nazwisko: "Nowak", obecny: false },
    { id: 3, imie: "Kacper", nazwisko: "Wiśniewski", obecny: true },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 Frekwencja</h2>

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Uczeń</th>
              <th className="p-2 border">Obecność</th>
            </tr>
          </thead>

          <tbody>
            {uczniowie.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.imie} {u.nazwisko}</td>
                <td className="border p-2 text-center">
                  <input type="checkbox" defaultChecked={u.obecny} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="bg-purple-600 text-white mt-4 px-4 py-2 rounded hover:bg-purple-700">
          Zapisz frekwencję
        </button>
      </div>
    </div>
  );
}
