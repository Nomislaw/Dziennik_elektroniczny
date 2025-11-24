import { useEffect, useState } from "react";
import { Uzytkownik } from "../../types/Uzytkownik";
import { OcenaCreateDto } from "../../types/Ocena";
import { TypOceny } from "../../types/TypOceny";
import { addOcena } from "../../api/OcenyService";

interface RodzicSimpleDto {
  id: number;
  imie: string;
  nazwisko: string;
}

interface UczenDto {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  klasaNazwa: string;
  klasaId: number;
  czyEmailPotwierdzony: boolean;
  rodzice: RodzicSimpleDto[];
}

interface OcenyNauczycielProps {
  nauczyciel: Uzytkownik;
}

export default function OcenyNauczyciel({ nauczyciel }: OcenyNauczycielProps) {
  const [uczniowie, setUczniowie] = useState<UczenDto[]>([]);
  const [wartosc, setWartosc] = useState<number>(5);
  const [typ, setTyp] = useState<TypOceny>(TypOceny.INNE);
  const [opis, setOpis] = useState<string>("");
  const [przedmiotId, setPrzedmiotId] = useState<number>(1); // tymczasowo, możesz dodać select przedmiotów

  // Pobieranie uczniów z backendu
  useEffect(() => {
    const fetchUczniowie = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/Uzytkownik/uczniowie", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUczniowie(data);
      } catch (err) {
        console.error("Błąd pobierania uczniów:", err);
      }
    };
    fetchUczniowie();
  }, []);

  const handleDodajOcene = async (uczenId: number) => {
    const payload: OcenaCreateDto = {
      DataWystawienia: new Date().toISOString(),
      Wartosc: wartosc,
      Typ: typ,
      Opis: opis,
      UczenId: uczenId,
      NauczycielId: nauczyciel.id,
      PrzedmiotId: przedmiotId,
    };

    try {
      await addOcena(payload);
      alert(`Dodano ocenę dla ucznia!`);
    } catch (err) {
      console.error(err);
      alert("Błąd przy dodawaniu oceny");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🧮 Wystawianie ocen</h2>

      <table className="w-full border bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Uczeń</th>
            <th className="p-2 border">Wartość</th>
            <th className="p-2 border">Typ</th>
            <th className="p-2 border">Opis</th>
            <th className="p-2 border">Akcja</th>
          </tr>
        </thead>
        <tbody>
          {uczniowie.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.imie} {u.nazwisko}</td>
              <td className="border p-2">
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={wartosc}
                  onChange={(e) => setWartosc(Number(e.target.value))}
                  className="border p-1 rounded w-16 text-center"
                />
              </td>
              <td className="border p-2">
                <select value={typ} onChange={(e) => setTyp(e.target.value as TypOceny)}>
                  {Object.values(TypOceny).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={opis}
                  onChange={(e) => setOpis(e.target.value)}
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="border p-2">
                <button
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  onClick={() => handleDodajOcene(u.id)}
                >
                  Dodaj ocenę
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
