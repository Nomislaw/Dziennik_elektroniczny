// src/pages/teacher/FrekwencjaNauczyciel.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  pobierzFrekwencjeFiltrowane,
  dodajFrekwencja,
  edytujFrekwencja,
  FrekwencjaDetailsDto,
  FrekwencjaCreateDto,
  FrekwencjaUpdateDto,
} from "../../api/FrekwencjaService";
import {
  pobierzZajeciaNauczyciela,
  ZajeciaDto,
} from "../../api/ZajeciaService";
import { pobierzUczniow } from "../../api/UzytkownikService";
import { pobierzDatyDlaDniaTygodnia } from "../../api/SemestrService"; // 🔥 NOWE!
import { pobierzPlan } from "../../api/PlanService";

const dniTygodnia: { value: number; label: string }[] = [
  { value: 1, label: "Poniedziałek" },
  { value: 2, label: "Wtorek" },
  { value: 3, label: "Środa" },
  { value: 4, label: "Czwartek" },
  { value: 5, label: "Piątek" },
];

export interface PlanDto {
  id: number;
  klasaId: number;
  klasaNazwa: string;
  semestrId: number;
  semestrNazwa: string;
}

interface UczenDto {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  klasaNazwa: string;
  klasaId: number;
  czyEmailPotwierdzony: boolean;
  rodzice: any[];
}

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

interface FrekwencjaNauczycielProps {
  nauczycielId: number;
}

const FrekwencjaNauczyciel: React.FC<FrekwencjaNauczycielProps> = ({
  nauczycielId,
}) => {
  const [zajecia, setZajecia] = useState<ZajeciaDto[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 NOWE STANY dla dat
  const [selectedZajecia, setSelectedZajecia] = useState<ZajeciaDto | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [availableDates, setAvailableDates] = useState<{ label: string; value: string }[]>([]);

  const [plan, setPlan] = useState<PlanDto | null>(null);

  const [wszyscyUczniowie, setWszyscyUczniowie] = useState<UczenDto[]>([]);
  const [frekwencjaDlaZajec, setFrekwencjaDlaZajec] = useState<FrekwencjaDetailsDto[]>([]);
  const [zapisLoading, setZapisLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Zmiany niezapisane

  const [statusy, setStatusy] = useState<Record<number, number>>({});
  const [frekwencjaIds, setFrekwencjaIds] = useState<Record<number, number>>({});

  // Pobierz uczniów
  useEffect(() => {
    const loadUczniowie = async () => {
      try {
        const uczniowieRes = await pobierzUczniow();
        console.log("✅ Uczniowie:", uczniowieRes?.length);
        setWszyscyUczniowie(Array.isArray(uczniowieRes) ? uczniowieRes : []);
      } catch (error) {
        console.error("❌ Błąd uczniów:", error);
      }
    };
    loadUczniowie();
  }, []);

  // Pobierz zajęcia
  useEffect(() => {
    const load = async () => {
      try {
        const zajeciaRes = await pobierzZajeciaNauczyciela(nauczycielId);
        console.log("✅ Zajęcia:", zajeciaRes?.length);
        setZajecia(Array.isArray(zajeciaRes) ? zajeciaRes : []);
      } catch (error) {
        console.error("❌ Błąd zajęć:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [nauczycielId]);

  // 🔥 NOWE: Pobierz daty z backendu po wybraniu zajęć
  useEffect(() => {
  const loadDaty = async () => {
    if (!selectedZajecia) return;

    try {
      console.log("📅 Pobieram plan dla planId:", selectedZajecia.planId);

      const planRes = await pobierzPlan(selectedZajecia?.planId ?? 0);
      setPlan(planRes);

      console.log("📅 Pobieram daty dla semestrId:", planRes.semestrId);

      const datyRaw = await pobierzDatyDlaDniaTygodnia(
        selectedZajecia.dzienTygodnia,
        planRes.semestrId // ✅ POPRAWNIE
      );

      const formattedDates = datyRaw.map((date: string) => ({
        label: new Date(date + "T00:00:00").toLocaleDateString("pl-PL", {
          weekday: "long",
          day: "numeric",
          month: "numeric",
        }),
        value: date,
      }));

      setAvailableDates(formattedDates);

      const todayForDay = getNextWeekday(todayISO(), selectedZajecia.dzienTygodnia);
      const todayInList = formattedDates.find(d => d.value === todayForDay);

      setSelectedDate(todayInList?.value || formattedDates[0]?.value || todayForDay);
    } catch (error) {
      console.error("❌ Błąd dat:", error);
      setAvailableDates([]);
    }
  };

  loadDaty();
}, [selectedZajecia]);


  // 🔥 NOWE: Automatycznie ładuj frekwencję po zmianie daty
  useEffect(() => {
    if (selectedZajecia && selectedDate && availableDates.length > 0) {
      loadFrekwencja(selectedZajecia.id, selectedDate);
    }
  }, [selectedZajecia, selectedDate]);

  const timetableRows = useMemo(() => {
    const slotsSet = new Set<string>();
    zajecia.forEach((z) => {
      slotsSet.add(`${z.godzinaRozpoczecia}-${z.godzinaZakonczenia}`);
    });
    const slots = Array.from(slotsSet).sort();

    return slots.map((slot) => {
      const [start, end] = slot.split("-");
      const byDay: Record<number, ZajeciaDto | null> = {};
      dniTygodnia.forEach((d) => {
        byDay[d.value] = zajecia.find(
          (z) =>
            z.dzienTygodnia === d.value &&
            z.godzinaRozpoczecia === start &&
            z.godzinaZakonczenia === end
        ) ?? null;
      });
      return { slot, start, end, byDay };
    });
  }, [zajecia]);

  // 🔥 Ulepszona funkcja ładowania frekwencji z EDIT/ADD logiką
  const loadFrekwencja = useCallback(async (zajeciaId: number, data: string) => {
    try {
      console.log("📥 Ładuję frekwencję:", zajeciaId, data);
      const frekwencjaRes = await pobierzFrekwencjeFiltrowane(zajeciaId, data);
      setFrekwencjaDlaZajec(frekwencjaRes);

      const statusMap: Record<number, number> = {};
      const idMap: Record<number, number> = {};
      
      frekwencjaRes.forEach((f: FrekwencjaDetailsDto) => {
        statusMap[f.uczenId] = f.status;
        idMap[f.uczenId] = f.id;
      });

      const uczniowieKlasy = getUczniowieDlaZajec();
      uczniowieKlasy.forEach((u) => {
        if (!(u.id in statusMap)) {
          statusMap[u.id] = -1; // Domyślnie obecny
        }
      });

      console.log("✅ Frekwencja załadowana:", Object.keys(statusMap).length, "uczniów");
      setStatusy(statusMap);
      setFrekwencjaIds(idMap);
      setIsDirty(false);
    } catch (error) {
      console.error("❌ Błąd frekwencji:", error);
    }
  }, [wszyscyUczniowie]);

  const getUczniowieDlaZajec = (): UczenDto[] => {
    if (!selectedZajecia) return [];
    // 🎯 Filtrowanie po planId (klasa)
    return wszyscyUczniowie.filter((u) => u.klasaId === selectedZajecia.klasaId);
  };

 function getNextWeekday(dateStr: string, weekday: number): string {
  const date = new Date(dateStr + "T00:00:00"); // ⬅️ BEZ Z
  const currentDay = date.getDay(); // 0–6
  const targetDay = weekday;        // 1–5

  const diff =
    (targetDay - currentDay + 7) % 7;

  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}


  const handleZajeciaClick = (z: ZajeciaDto) => {
    console.log("🖱️ Wybrano zajęcia:", z.id, z.przedmiotNazwa);
    setSelectedZajecia(z);
  };

  const handleDateChange = (date: string) => {
    console.log("📅 Wybrano datę:", date);
    setSelectedDate(date);
  };

  const handleStatusChange = (uczenId: number, value: string) => {
    const newStatus = Number(value) || 0;
    setStatusy((prev) => {
      const newStatusy = { ...prev, [uczenId]: newStatus };
      setIsDirty(true);
      return newStatusy;
    });
  };

  // 🔥 INTUICYJNY ZAPIS z EDIT/ADD automatyką
  const handleZapiszFrekwencje = async () => {
    if (!selectedZajecia) return;

    setZapisLoading(true);
    try {
      const uczniowieKlasy = getUczniowieDlaZajec();
      const promises: Promise<any>[] = [];

      console.log(`💾 Zapisuję ${uczniowieKlasy.length} uczniów...`);

      uczniowieKlasy.forEach((u) => {
          const status = statusy[u.id] ?? -1;

          if (status === -1) return;

          const frekwencjaId = frekwencjaIds[u.id];

          if (frekwencjaId) {
            promises.push(
              edytujFrekwencja(frekwencjaId, { status } as FrekwencjaUpdateDto)
            );
          } else {
            promises.push(
              dodajFrekwencja({
                data: selectedDate,
                status,
                uczenId: u.id,
                zajeciaId: selectedZajecia.id,
              })
            );
          }
        });

      await Promise.all(promises);
      console.log("✅ Zapiszano pomyślnie!");
      alert("Frekwencja zapisana pomyślnie!");
      setIsDirty(false);
      
      // 🔄 Przeładuj frekwencję
      await loadFrekwencja(selectedZajecia.id, selectedDate);
    } catch (error) {
      console.error("❌ Błąd zapisu:", error);
      alert("Błąd zapisu frekwencji");
    } finally {
      setZapisLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Ładowanie...</div>
      </div>
    );
  }

  const uczniowieDlaZajec = getUczniowieDlaZajec();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Frekwencja nauczyciela</h2>
        <p className="text-sm text-gray-600 mt-1">
          ({zajecia.length} zajęć, {wszyscyUczniowie.length} uczniów)
        </p>
      </div>

      {/* Plan lekcji */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Godzina
                </th>
                {dniTygodnia.map((d) => (
                  <th key={d.value} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timetableRows.length === 0 ? (
                <tr>
                  <td colSpan={1 + dniTygodnia.length} className="px-4 py-8 text-center text-sm text-gray-500">
                    Brak zajęć dla tego nauczyciela.
                  </td>
                </tr>
              ) : (
                timetableRows.map((row) => (
                  <tr key={row.slot}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {row.start} - {row.end}
                    </td>
                    {dniTygodnia.map((d) => {
                      const z = row.byDay[d.value];
                      if (!z) {
                        return <td key={d.value} className="px-4 py-2 text-sm text-gray-400">-</td>;
                      }
                      return (
                        <td
                          key={d.value}
                          className={`px-4 py-2 text-sm align-top cursor-pointer p-2 rounded transition-colors ${
                            selectedZajecia?.id === z.id
                              ? "bg-blue-100 border-2 border-blue-400"
                              : "hover:bg-blue-50 text-gray-900"
                          }`}
                          onClick={() => handleZajeciaClick(z)}
                        >
                          <div className="font-medium mb-1">{z.przedmiotNazwa ?? z.przedmiotId}</div>
                          <div className="text-xs text-gray-600 mb-1">{z.planNazwa ?? `Plan ${z.planId}`}</div>
                          <div className="text-xs text-gray-600">Sala: {z.salaNazwa ?? z.salaId}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔥 Panel frekwencji z SELECTEM DAT */}
      {selectedZajecia && availableDates.length > 0 && (
        <div className="bg-white shadow-sm border rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Frekwencja – {selectedZajecia.przedmiotNazwa ?? selectedZajecia.przedmiotId}
              </h3>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    {dniTygodnia.find((d) => d.value === selectedZajecia.dzienTygodnia)?.label}:
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  >
                    {availableDates.map((date) => (
                      <option key={date.value} value={date.value}>
                        {date.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {uczniowieDlaZajec.length} uczniów
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isDirty && (
                <span className="text-sm text-orange-600 font-medium">Niezapisane zmiany</span>
              )}
              <button
                onClick={() => {
                  setSelectedZajecia(null);
                  setAvailableDates([]);
                  setStatusy({});
                  setIsDirty(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-1 rounded hover:bg-gray-100"
              >
                Zamknij
              </button>
            </div>
          </div>

          {uczniowieDlaZajec.length > 0 ? (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uczeń
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uczniowieDlaZajec.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {u.imie} {u.nazwisko}
                          <div className="text-xs text-gray-500 mt-0.5">{u.klasaNazwa}</div>
                        </td>
                        <td className="px-4 py-3 align-top text-right">
                          <select
                            value={statusy[u.id] ?? -1}
                            onChange={(e) => handleStatusChange(u.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                          >
                            <option value={-1}>Nie wystawiono</option>
                            <option value={0}>Nieobecny</option>
                            <option value={1}>Obecny</option>
                            <option value={2}>Spóźniony</option>
                            <option value={3}>Usprawiedliwiony</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleZapiszFrekwencje}
                  disabled={zapisLoading || !isDirty}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-md font-medium shadow-sm transition-colors"
                >
                  {zapisLoading ? "Zapisywanie..." : "Zapisz frekwencję"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">Brak uczniów w klasie</p>
              <p className="text-sm">{selectedZajecia?.planId}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FrekwencjaNauczyciel;
