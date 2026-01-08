import { useEffect, useState, useCallback } from "react";
import {
  pobierzOcenyUcznia,
  OcenyUczniaResponseDto,
  OcenyPoPrzedmiotachDto,
  OcenaUczenDto
} from "../../api/PanelUczniaService";
import { Uzytkownik } from "../../types/Uzytkownik";

interface OcenyProps {
  uczenId: number;
}

export default function Oceny({ uczenId }: OcenyProps) {
  const [przedmioty, setPrzedmioty] = useState<OcenyPoPrzedmiotachDto[]>([]);
  const [sredniaOgolna, setSredniaOgolna] = useState<number>(0);

  const idUczen = uczenId;

  const odswiezOceny = useCallback(async () => {
    try {
      const response: OcenyUczniaResponseDto = await pobierzOcenyUcznia(idUczen);
      setPrzedmioty(response.ocenyPoPrzedmiotach);
      setSredniaOgolna(response.sredniaOgolna);
    } catch (error) {
      console.error("Błąd pobierania ocen:", error);
      setPrzedmioty([]);
      setSredniaOgolna(0);
    }
  }, [idUczen]);

  useEffect(() => {
    odswiezOceny();
  }, [odswiezOceny]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">📝 Oceny ucznia</h1>

      {/* Średnia ogólna */}
      <div className="mb-4 p-4 bg-blue-100 rounded-lg text-blue-800 font-semibold">
        Średnia ogólna: {sredniaOgolna.toFixed(2)}
      </div>

      {przedmioty.map((p, idx) => (
        <div key={idx} className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
            {p.przedmiotNazwa}
            <span className="text-sm text-gray-500">
              Średnia: {p.sredniaArytmetyczna.toFixed(2)}
            </span>
          </h2>

          <div className="flex flex-col gap-2">
            {p.oceny.map((o: OcenaUczenDto) => (
              <div
                key={o.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center border-b last:border-b-0 py-1"
              >
                {/* Kwadracik z numerem oceny */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 bg-blue-500 text-white font-bold flex items-center justify-center rounded"
                    title={o.opis || "Brak opisu"} // tooltip przy najechaniu
                  >
                    {o.wartosc}
                  </div>
                  <span className="text-gray-600 text-sm">{o.typOceny}</span>
                </div>

                {/* Nauczyciel i data */}
                <div className="text-gray-500 text-sm md:text-right">
                  {o.nauczyciel} | {new Date(o.dataWystawienia).toLocaleDateString()}
                </div>
              </div>
            ))}

            {p.oceny.length === 0 && (
              <p className="text-gray-500 text-sm mt-2">Brak ocen</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
