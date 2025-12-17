import { useEffect, useState } from "react";
import { Uzytkownik } from "../../types/Uzytkownik";
import { OcenaCreateDto } from "../../types/Ocena";
import { TypOceny } from "../../types/TypOceny";
import { pobierzUczniow } from "../../api/UzytkownikService";
import { addOcena, pobierzOceny, edytujOcene, usunOcene } from "../../api/OcenyService";
import { pobierzPrzedmioty } from "../../api/PrzedmiotService";

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

interface PrzedmiotDto {
  id: number;
  nazwa: string;
}

interface OcenaDraft {
  wartosc: number;
  typ: TypOceny;
  opis: string;
}

interface OcenaDoEdycji extends OcenaDraft {
  id: number;
}


interface OcenyNauczycielProps {
  nauczyciel: Uzytkownik;
}

export default function OcenyNauczyciel({ nauczyciel }: OcenyNauczycielProps) {
  const [uczniowie, setUczniowie] = useState<UczenDto[]>([]);
  const [przedmioty, setPrzedmioty] = useState<PrzedmiotDto[]>([]);
  const [wybranyPrzedmiot, setWybranyPrzedmiot] = useState<number | null>(null);
  const [ocenyDraft, setOcenyDraft] = useState<Record<number, OcenaDraft>>({});
  const [loadingUczenId, setLoadingUczenId] = useState<number | null>(null);
  const [ocenyUcznia, setOcenyUcznia] = useState<Record<number, OcenaDoEdycji[]>>({});

  // Pobieranie uczniów i przedmiotów
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uczniowieData, przedmiotyData] = await Promise.all([
          pobierzUczniow(),
          pobierzPrzedmioty(),
        ]);
        setUczniowie(uczniowieData);
        setPrzedmioty(przedmiotyData);

        const drafts: Record<number, OcenaDraft> = {};
        uczniowieData.forEach((u: any) => {
          drafts[u.id] = { wartosc: 5, typ: TypOceny.INNE, opis: "" };
        });
        setOcenyDraft(drafts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // ===== DODAWANIE OCENY =====
  const handleDodajOcene = async (uczenId: number) => {
    if (!wybranyPrzedmiot) return;

    const draft = ocenyDraft[uczenId];
    if (!draft) return;

    setLoadingUczenId(uczenId);
    try {
      await addOcena({
        DataWystawienia: new Date().toISOString(),
        Wartosc: draft.wartosc,
        Typ: draft.typ,
        Opis: draft.opis,
        UczenId: uczenId,
        NauczycielId: nauczyciel.id,
        PrzedmiotId: wybranyPrzedmiot,
      });

      // reset formularza
      setOcenyDraft((prev) => ({
        ...prev,
        [uczenId]: { wartosc: 5, typ: TypOceny.INNE, opis: "" },
      }));
alert("Dodano ocene pomyślnie");
      await odswiezOceny(uczenId);

      
    } catch (err) {
      console.error(err);
      alert("Nie udało się dodać oceny");
    } finally {
      setLoadingUczenId(null);
    }
  };

  // ===== POBIERANIE OCEN UCZNIA =====
  const odswiezOceny = async (uczenId: number) => {
    try {
      const wszystkieOceny = await pobierzOceny();
      const ocenyDlaUcznia = wszystkieOceny.filter((o: any) => o.UczenId === uczenId);
      setOcenyUcznia((prev) => ({ ...prev, [uczenId]: ocenyDlaUcznia }));
    } catch (err) {
      console.error(err);
    }
  };

  // ===== USUWANIE OCENY =====
  const handleUsunOcene = async (uczenId: number, ocenaId: number) => {
    if (!window.confirm("Na pewno usunąć tę ocenę?")) return;
    try {
      await usunOcene(ocenaId);
      await odswiezOceny(uczenId);
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć oceny");
    }
  };

  // ===== EDYCJA OCENY =====
const handleEdytujOcene = async (uczenId: number, ocena: OcenaDoEdycji) => {
  try {
    await edytujOcene(ocena.id, {
      wartosc: ocena.wartosc,
      typ: ocena.typ,
      opis: ocena.opis,
    });
    await odswiezOceny(uczenId);
  } catch (err) {
    console.error(err);
    alert("Nie udało się edytować oceny");
  }
};


  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">🧮 Panel wystawiania ocen</h2>

      {/* WYBÓR PRZEDMIOTU */}
      <div className="flex gap-4 items-center bg-gray-50 p-4 rounded">
        <label>
          Przedmiot:
          <select
            className="ml-2 border rounded p-1"
            value={wybranyPrzedmiot ?? ""}
            onChange={(e) => setWybranyPrzedmiot(Number(e.target.value))}
          >
            <option value="">-- wybierz --</option>
            {przedmioty.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nazwa}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* TABELA UCZNIÓW */}
      <table className="w-full border bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Uczeń</th>
            <th className="p-2 border">Ocena</th>
            <th className="p-2 border">Typ</th>
            <th className="p-2 border">Opis</th>
            <th className="p-2 border">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {uczniowie.map((u) => {
            const draft = ocenyDraft[u.id];
            const oceny = ocenyUcznia[u.id] ?? [];
            return (
              <tr key={u.id}>
                <td className="border p-2 font-medium">{u.imie} {u.nazwisko}</td>

                <td className="border p-2">
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={draft?.wartosc ?? 5}
                    onChange={(e) =>
                      setOcenyDraft((prev) => ({
                        ...prev,
                        [u.id]: { ...prev[u.id], wartosc: Number(e.target.value) },
                      }))
                    }
                    className="w-14 border rounded text-center"
                  />
                </td>

                <td className="border p-2">
                  <select
                    value={draft?.typ ?? TypOceny.INNE}
                    onChange={(e) =>
                      setOcenyDraft((prev) => ({
                        ...prev,
                        [u.id]: { ...prev[u.id], typ: Number(e.target.value) },
                      }))
                    }
                  >
                    {Object.keys(TypOceny)
                      .filter((k) => isNaN(Number(k)))
                      .map((k) => (
                        <option key={k} value={TypOceny[k as any]}>
                          {k}
                        </option>
                      ))}
                  </select>
                </td>

                <td className="border p-2">
                  <input
                    type="text"
                    value={draft?.opis ?? ""}
                    onChange={(e) =>
                      setOcenyDraft((prev) => ({
                        ...prev,
                        [u.id]: { ...prev[u.id], opis: e.target.value },
                      }))
                    }
                    className="border rounded p-1 w-full"
                  />
                </td>

                <td className="border p-2 flex gap-1">
                  <button
                    className="bg-purple-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDodajOcene(u.id)}
                    disabled={!wybranyPrzedmiot || loadingUczenId === u.id}
                  >
                    Dodaj
                  </button>
                  {oceny.length > 0 && (
                    <button
                      className="bg-gray-600 text-white px-2 py-1 rounded"
                      onClick={() => odswiezOceny(u.id)}
                    >
                      Odśwież
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* LISTA ISTNIEJĄCYCH OCEN */}
      {uczniowie.map((u) => {
        const oceny = ocenyUcznia[u.id] ?? [];
        if (oceny.length === 0) return null;

        return (
          <div key={`oceny-${u.id}`} className="mt-4">
            <h3 className="font-semibold">{u.imie} {u.nazwisko} - Oceny</h3>
            <table className="w-full border bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Wartość</th>
                  <th className="p-2 border">Typ</th>
                  <th className="p-2 border">Opis</th>
                  <th className="p-2 border">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {oceny.map((o) => (
                  <tr key={o.id}>
                    <td className="border p-2">{o.wartosc}</td>
                    <td className="border p-2">{Object.keys(TypOceny).find(
  (k) => TypOceny[k as keyof typeof TypOceny] === o.typ
)
}</td>
                    <td className="border p-2">{o.opis}</td>
                    <td className="border p-2 flex gap-1">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          const nowaWartosc = prompt("Podaj nową wartość", String(o.wartosc));
                          if (!nowaWartosc) return;
                          const nowyTyp = prompt("Podaj nowy typ", String(o.typ));
                          const nowyOpis = prompt("Podaj nowy opis", o.opis);
                                handleEdytujOcene(u.id, {
                            id: o.id,              // <-- dodaj ID
                            wartosc: Number(nowaWartosc),
                            typ: Number(nowyTyp),
                            opis: nowyOpis || "",
                          });

                        }}
                      >
                        Edytuj
                      </button>
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => handleUsunOcene(u.id, o.id)}
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
