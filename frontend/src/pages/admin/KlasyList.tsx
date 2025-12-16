import { useEffect, useState } from "react";
import {
  pobierzKlasa,
  dodajKlasa,
  usunKlasa,
  edytujKlasa,
} from "../../api/KlasaService";

interface Klasa {
  id: number;
  nazwa: string;
  rok: number;
  wychowawcaId?: number;
  planId?:number;
}

export default function KlasyList() {
  const [klasy, setKlasy] = useState<Klasa[]>([]);
  const [nowaNazwa, setNowaNazwa] = useState("");
  const [nowyRok, setNowyRok] = useState<number | "">("");

  const [edytowanaKlasaId, setEdytowanaKlasaId] = useState<number | null>(null);
  const [edytowanaNazwa, setEdytowanaNazwa] = useState("");
  const [edytowanyRok, setEdytowanyRok] = useState<number | "">("");

  useEffect(() => {
    loadKlasy();
  }, []);

  const loadKlasy = async () => {
    try {
      const response = await pobierzKlasa();
      setKlasy(response);
    } catch (e) {
      console.error("Błąd ładowania klas:", e);
    }
  };

  const handleAdd = async () => {
    if (!nowaNazwa.trim() || nowyRok === "")
      return alert("Podaj nazwę i rok");

    try {
      await dodajKlasa({
  nazwa: nowaNazwa,
  rok: Number(nowyRok),
  wychowawcaId: null,
  planId: null,
});

      setNowaNazwa("");
      setNowyRok("");
      loadKlasy();
    } catch (e) {
      console.error("Błąd dodawania klasy:", e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno usunąć tę klasę?")) return;

    try {
      await usunKlasa(id);
      loadKlasy();
    } catch (e) {
      console.error("Błąd usuwania klasy:", e);
    }
  };

  const handleEditStart = (klasa: Klasa) => {
    setEdytowanaKlasaId(klasa.id);
    setEdytowanaNazwa(klasa.nazwa);
    setEdytowanyRok(klasa.rok);
  };

  const handleEditCancel = () => {
    setEdytowanaKlasaId(null);
    setEdytowanaNazwa("");
    setEdytowanyRok("");
  };

  const handleEditSave = async (id: number) => {
    if (!edytowanaNazwa.trim() || edytowanyRok === "")
      return alert("Uzupełnij wszystkie pola");

    try {
      await edytujKlasa(id, {
        nazwa: edytowanaNazwa,
        rok: Number(edytowanyRok),
      });
      setEdytowanaKlasaId(null);
      loadKlasy();
    } catch (e) {
      console.error("Błąd edycji klasy:", e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Dodawanie */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-3">Dodaj klasę</h2>

        <input
          value={nowaNazwa}
          onChange={(e) => setNowaNazwa(e.target.value)}
          placeholder="Nazwa klasy (np. 1A)"
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <input
          type="number"
          value={nowyRok}
          onChange={(e) =>
            setNowyRok(e.target.value ? Number(e.target.value) : "")
          }
          placeholder="Rok"
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <button
          onClick={handleAdd}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          ➕ Dodaj klasę
        </button>
      </div>

      {/* Lista */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Lista klas</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Nazwa</th>
              <th className="py-2">Rok</th>
              <th className="py-2"></th>
            </tr>
          </thead>

          <tbody>
            {klasy.map((klasa) => (
              <tr key={klasa.id} className="border-b">
                <td className="py-2">{klasa.id}</td>

                <td>
                  {edytowanaKlasaId === klasa.id ? (
                    <input
                      value={edytowanaNazwa}
                      onChange={(e) => setEdytowanaNazwa(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    klasa.nazwa
                  )}
                </td>

                <td>
                  {edytowanaKlasaId === klasa.id ? (
                    <input
                      type="number"
                      value={edytowanyRok}
                      onChange={(e) =>
                        setEdytowanyRok(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    klasa.rok
                  )}
                </td>

                <td className="space-x-2">
                  {edytowanaKlasaId === klasa.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(klasa.id)}
                        className="text-green-600 hover:underline"
                      >
                        💾 Zapisz
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-gray-600 hover:underline"
                      >
                        ❌ Anuluj
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditStart(klasa)}
                        className="text-blue-600 hover:underline"
                      >
                        ✏️ Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(klasa.id)}
                        className="text-red-600 hover:underline ml-2"
                      >
                        🗑 Usuń
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {klasy.length === 0 && (
          <p className="text-gray-500 mt-4">Brak klas w bazie.</p>
        )}
      </div>
    </div>
  );
}
