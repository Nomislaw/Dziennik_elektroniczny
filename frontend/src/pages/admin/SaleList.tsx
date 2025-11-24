import { useEffect, useState } from "react";
import { pobierzSale, dodajSale, usunSale } from "../../api/SaleService";

interface Sala {
  id: number;
  numer: string;
}

export default function SaleList() {
  const [sale, setSale] = useState<Sala[]>([]);
  const [nowaSala, setNowaSala] = useState("");

  // Pobieranie sal z API
  useEffect(() => {
    loadSale();
  }, []);

  const loadSale = async () => {
    try {
      const response = await pobierzSale();
      setSale(response);
    } catch (e) {
      console.error("Błąd ładowania sal:", e);
    }
  };

  const handleAdd = async () => {
    if (!nowaSala.trim()) return alert("Wpisz numer sali");

    try {
      await dodajSale({ numer: nowaSala });
      setNowaSala("");
      loadSale();
    } catch (e) {
      console.error("Błąd dodawania sali:", e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno usunąć tę salę?")) return;


    try {
      await usunSale(id);
      loadSale();
    } catch (e) {
      console.error("Błąd usuwania sali:", e);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Formularz dodawania */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-3">Dodaj salę</h2>

        <input
          value={nowaSala}
          onChange={(e) => setNowaSala(e.target.value)}
          placeholder="Numer sali (np. 12A)"
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <button
          onClick={handleAdd}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          ➕ Dodaj salę
        </button>
      </div>

      {/* Lista sal */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Lista sal</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Numer</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {sale.map((sala) => (
              <tr key={sala.id} className="border-b">
                <td className="py-2">{sala.id}</td>
                <td>{sala.numer}</td>
                <td>
                  <button
                    onClick={() => handleDelete(sala.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑 Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sale.length === 0 && (
          <p className="text-gray-500 mt-4">Brak sal w bazie.</p>
        )}
      </div>
    </div>
  );
}
