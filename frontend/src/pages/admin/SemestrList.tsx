// src/components/Semestr/SemestryList.tsx
import { useEffect, useState } from "react";
import {
  pobierzSemestry,
  dodajSemestr,
  edytujSemestr,
  usunSemestr,
  Semestr,
} from "../../api/SemestrService";

export default function SemestryList() {
  const [semestry, setSemestry] = useState<Semestr[]>([]);

  const [nowaDataRozpoczecia, setNowaDataRozpoczecia] = useState("");
  const [nowaDataZakonczenia, setNowaDataZakonczenia] = useState("");
  const [nowyNumer, setNowyNumer] = useState<number | "">("");

  const [edytowanySemestrId, setEdytowanySemestrId] = useState<number | null>(
    null
  );
  const [edytowanaDataRozpoczecia, setEdytowanaDataRozpoczecia] =
    useState("");
  const [edytowanaDataZakonczenia, setEdytowanaDataZakonczenia] =
    useState("");
  const [edytowanyNumer, setEdytowanyNumer] = useState<number | "">("");

  useEffect(() => {
    loadSemestry();
  }, []);

  const loadSemestry = async () => {
    try {
      const response = await pobierzSemestry();
      setSemestry(response);
    } catch (e) {
      console.error("Błąd ładowania semestrów:", e);
    }
  };

  const handleAdd = async () => {
    if (
      !nowaDataRozpoczecia ||
      !nowaDataZakonczenia ||
      nowyNumer === ""
    ) {
      return alert("Podaj daty rozpoczęcia, zakończenia i numer semestru");
    }

    try {
      await dodajSemestr({
        dataRozpoczecia: nowaDataRozpoczecia,
        dataZakonczenia: nowaDataZakonczenia,
        numer: Number(nowyNumer),
      });

      setNowaDataRozpoczecia("");
      setNowaDataZakonczenia("");
      setNowyNumer("");
      loadSemestry();
    } catch (e) {
      console.error("Błąd dodawania semestru:", e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno usunąć ten semestr?")) return;

    try {
      await usunSemestr(id);
      loadSemestry();
    } catch (e) {
      console.error("Błąd usuwania semestru:", e);
    }
  };

  const handleEditStart = (semestr: Semestr) => {
    setEdytowanySemestrId(semestr.id);
    // zakładam, że backend zwraca ISO, więc bierzemy tylko yyyy-MM-dd do input[type=date]
    setEdytowanaDataRozpoczecia(semestr.dataRozpoczecia.substring(0, 10));
    setEdytowanaDataZakonczenia(semestr.dataZakonczenia.substring(0, 10));
    setEdytowanyNumer(semestr.numer);
  };

  const handleEditCancel = () => {
    setEdytowanySemestrId(null);
    setEdytowanaDataRozpoczecia("");
    setEdytowanaDataZakonczenia("");
    setEdytowanyNumer("");
  };

  const handleEditSave = async (id: number) => {
    if (
      !edytowanaDataRozpoczecia ||
      !edytowanaDataZakonczenia ||
      edytowanyNumer === ""
    ) {
      return alert("Uzupełnij wszystkie pola");
    }

    try {
      await edytujSemestr(id, {
        dataRozpoczecia: edytowanaDataRozpoczecia,
        dataZakonczenia: edytowanaDataZakonczenia,
        numer: Number(edytowanyNumer),
      });

      setEdytowanySemestrId(null);
      loadSemestry();
    } catch (e) {
      console.error("Błąd edycji semestru:", e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Dodawanie */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-3">Dodaj semestr</h2>

        <label className="block mb-2 text-sm font-medium">
          Data rozpoczęcia
        </label>
        <input
          type="date"
          value={nowaDataRozpoczecia}
          onChange={(e) => setNowaDataRozpoczecia(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block mb-2 text-sm font-medium">
          Data zakończenia
        </label>
        <input
          type="date"
          value={nowaDataZakonczenia}
          onChange={(e) => setNowaDataZakonczenia(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block mb-2 text-sm font-medium">
          Numer semestru
        </label>
        <input
          type="number"
          value={nowyNumer}
          onChange={(e) =>
            setNowyNumer(e.target.value ? Number(e.target.value) : "")
          }
          placeholder="Numer semestru (np. 1 lub 2)"
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <button
          onClick={handleAdd}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          ➕ Dodaj semestr
        </button>
      </div>

      {/* Lista */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Lista semestrów</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Data rozpoczęcia</th>
              <th className="py-2">Data zakończenia</th>
              <th className="py-2">Numer</th>
              <th className="py-2"></th>
            </tr>
          </thead>

          <tbody>
            {semestry.map((semestr) => (
              <tr key={semestr.id} className="border-b">
                <td className="py-2">{semestr.id}</td>

                <td>
                  {edytowanySemestrId === semestr.id ? (
                    <input
                      type="date"
                      value={edytowanaDataRozpoczecia}
                      onChange={(e) =>
                        setEdytowanaDataRozpoczecia(e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    semestr.dataRozpoczecia.substring(0, 10)
                  )}
                </td>

                <td>
                  {edytowanySemestrId === semestr.id ? (
                    <input
                      type="date"
                      value={edytowanaDataZakonczenia}
                      onChange={(e) =>
                        setEdytowanaDataZakonczenia(e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    semestr.dataZakonczenia.substring(0, 10)
                  )}
                </td>

                <td>
                  {edytowanySemestrId === semestr.id ? (
                    <input
                      type="number"
                      value={edytowanyNumer}
                      onChange={(e) =>
                        setEdytowanyNumer(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    semestr.numer
                  )}
                </td>

                <td className="space-x-2">
                  {edytowanySemestrId === semestr.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(semestr.id)}
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
                        onClick={() => handleEditStart(semestr)}
                        className="text-blue-600 hover:underline"
                      >
                        ✏️ Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(semestr.id)}
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

        {semestry.length === 0 && (
          <p className="text-gray-500 mt-4">Brak semestrów w bazie.</p>
        )}
      </div>
    </div>
  );
}
