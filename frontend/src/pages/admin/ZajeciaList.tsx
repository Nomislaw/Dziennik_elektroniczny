// src/components/Zajecia/ZajeciaList.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  pobierzZajecia,
  dodajZajecia,
  edytujZajecia,
  usunZajecia,
  ZajeciaDto,
  ZajeciaCreateDto,
} from "../../api/ZajeciaService";
import { pobierzPlany } from "../../api/PlanService";
import { pobierzPrzedmioty } from "../../api/PrzedmiotService";
import { pobierzNauczycieli } from "../../api/UzytkownikService";
import { pobierzSale } from "../../api/SaleService";

// DTO – dopasuj do swoich plików / usuń jeśli masz już deklaracje w serwisach
export interface PlanDto {
  id: number;
  klasaNazwa: string;
  semestrNazwa: string;
}

export interface PrzedmiotDto {
  id: number;
  nazwa: string;
  skrot?: string | null;
}

export interface NauczycielDto {
  id: number;
  imie: string;
  nazwisko: string;
}

export interface SalaDto {
  id: number;
  numer: string;
}

const dniTygodnia: { value: number; label: string }[] = [
  { value: 1, label: "Poniedziałek" },
  { value: 2, label: "Wtorek" },
  { value: 3, label: "Środa" },
  { value: 4, label: "Czwartek" },
  { value: 5, label: "Piątek" },
  { value: 6, label: "Sobota" },
  { value: 0, label: "Niedziela" },
];

const dniOdPonDoPia = dniTygodnia.filter((d) => d.value >= 1 && d.value <= 5);

const getDzienLabel = (value: number) =>
  dniTygodnia.find((d) => d.value === value)?.label ?? value;

const ZajeciaList: React.FC = () => {
  const [zajecia, setZajecia] = useState<ZajeciaDto[]>([]);
  const [loading, setLoading] = useState(true);

  // dane do selectów
  const [plany, setPlany] = useState<PlanDto[]>([]);
  const [przedmioty, setPrzedmioty] = useState<PrzedmiotDto[]>([]);
  const [nauczyciele, setNauczyciele] = useState<NauczycielDto[]>([]);
  const [sale, setSale] = useState<SalaDto[]>([]);

  // filtr po planie - zawsze wymagany
  const [selectedPlanId, setSelectedPlanId] = useState<number | "">("");

  // modal dodawania
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // modal edycji
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedZajeciaId, setEditedZajeciaId] = useState<number | null>(null);

  // formularz dodawania
  const [nowaGodzinaStart, setNowaGodzinaStart] = useState("");
  const [nowaGodzinaKoniec, setNowaGodzinaKoniec] = useState("");
  const [nowyDzienTygodnia, setNowyDzienTygodnia] = useState<number | "">("");
  const [nowyPlanId, setNowyPlanId] = useState<number | "">("");
  const [nowyPrzedmiotId, setNowyPrzedmiotId] = useState<number | "">("");
  const [nowyNauczycielId, setNowyNauczycielId] = useState<number | "">("");
  const [nowaSalaId, setNowaSalaId] = useState<number | "">("");

  // formularz edycji
  const [editGodzinaStart, setEditGodzinaStart] = useState("");
  const [editGodzinaKoniec, setEditGodzinaKoniec] = useState("");
  const [editDzienTygodnia, setEditDzienTygodnia] = useState<number | "">("");
  const [editPlanId, setEditPlanId] = useState<number | "">("");
  const [editPrzedmiotId, setEditPrzedmiotId] = useState<number | "">("");
  const [editNauczycielId, setEditNauczycielId] = useState<number | "">("");
  const [editSalaId, setEditSalaId] = useState<number | "">("");

  useEffect(() => {
    const load = async () => {
      try {
        const [zajeciaRes, planyRes, przedmiotyRes, nauczycieleRes, saleRes] =
          await Promise.all([
            pobierzZajecia(),
            pobierzPlany(),
            pobierzPrzedmioty(),
            pobierzNauczycieli(),
            pobierzSale(),
          ]);
        setZajecia(zajeciaRes);
        setPlany(planyRes);
        setPrzedmioty(przedmiotyRes);
        setNauczyciele(nauczycieleRes);
        setSale(saleRes);

        // AUTOMATYCZNIE wybierz pierwszy plan jeśli istnieje
        if (planyRes.length > 0) {
          setSelectedPlanId(planyRes[0].id);
        }
      } catch (e) {
        console.error("Błąd ładowania danych:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const reloadZajecia = async () => {
    try {
      const data = await pobierzZajecia();
      setZajecia(data);
    } catch (e) {
      console.error("Błąd odświeżania zajęć:", e);
    }
  };

  const resetAddForm = () => {
    setNowaGodzinaStart("");
    setNowaGodzinaKoniec("");
    setNowyDzienTygodnia("");
    setNowyPlanId(selectedPlanId || ""); // Ustaw aktualny plan jako domyślny
    setNowyPrzedmiotId("");
    setNowyNauczycielId("");
    setNowaSalaId("");
  };

  const resetEditForm = () => {
    setEditedZajeciaId(null);
    setEditGodzinaStart("");
    setEditGodzinaKoniec("");
    setEditDzienTygodnia("");
    setEditPlanId("");
    setEditPrzedmiotId("");
    setEditNauczycielId("");
    setEditSalaId("");
  };

  const handleAdd = async () => {
    if (!selectedPlanId) {
      return alert("Najpierw wybierz plan");
    }
    if (
      !nowaGodzinaStart ||
      !nowaGodzinaKoniec ||
      nowyDzienTygodnia === "" ||
      nowyPlanId === "" ||
      nowyPrzedmiotId === "" ||
      nowyNauczycielId === "" ||
      nowaSalaId === ""
    ) {
      return alert("Uzupełnij wszystkie pola");
    }

    const payload: ZajeciaCreateDto = {
      godzinaRozpoczecia: nowaGodzinaStart,
      godzinaZakonczenia: nowaGodzinaKoniec,
      dzienTygodnia: Number(nowyDzienTygodnia),
      planId: Number(nowyPlanId),
      przedmiotId: Number(nowyPrzedmiotId),
      nauczycielId: Number(nowyNauczycielId),
      salaId: Number(nowaSalaId),
    };

    try {
      await dodajZajecia(payload);
      resetAddForm();
      setIsAddModalOpen(false);
      await reloadZajecia();
    } catch (e) {
      console.error("Błąd dodawania zajęć:", e);
      alert("Nie udało się dodać zajęć");
    }
  };

  const handleEditStart = (z: ZajeciaDto) => {
    setEditedZajeciaId(z.id);
    setEditGodzinaStart(z.godzinaRozpoczecia);
    setEditGodzinaKoniec(z.godzinaZakonczenia);
    setEditDzienTygodnia(z.dzienTygodnia);
    setEditPlanId(z.planId ?? "");
    setEditPrzedmiotId(z.przedmiotId ?? "");
    setEditNauczycielId(z.nauczycielId ?? "");
    setEditSalaId(z.salaId ?? "");
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    resetEditForm();
  };

  const handleEditSave = async () => {
    if (
      !editedZajeciaId ||
      !editGodzinaStart ||
      !editGodzinaKoniec ||
      editDzienTygodnia === "" ||
      editPlanId === "" ||
      editPrzedmiotId === "" ||
      editNauczycielId === "" ||
      editSalaId === ""
    ) {
      return alert("Uzupełnij wszystkie pola");
    }

    try {
      await edytujZajecia(editedZajeciaId, {
        godzinaRozpoczecia: editGodzinaStart,
        godzinaZakonczenia: editGodzinaKoniec,
        dzienTygodnia: Number(editDzienTygodnia),
        planId: Number(editPlanId),
        przedmiotId: Number(editPrzedmiotId),
        nauczycielId: Number(editNauczycielId),
        salaId: Number(editSalaId),
      });
      handleEditCancel();
      await reloadZajecia();
    } catch (e) {
      console.error("Błąd edycji zajęć:", e);
      alert("Nie udało się zaktualizować zajęć");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno usunąć te zajęcia?")) return;

    try {
      await usunZajecia(id);
      setZajecia((prev) => prev.filter((z) => z.id !== id));
    } catch (e) {
      console.error("Błąd usuwania zajęć:", e);
      alert("Nie udało się usunąć zajęć");
    }
  };

  // ZAWSZE filtruj po wybranym planie
  const filteredZajecia = useMemo(
    () => zajecia.filter((z) => z.planId === selectedPlanId),
    [zajecia, selectedPlanId]
  );

  // budowa slotów czasowych i mapy [slot][dzien] -> zajecia
  const timetableRows = useMemo(() => {
    // zbieramy unikalne sloty "start-end"
    const slotsSet = new Set<string>();
    filteredZajecia.forEach((z) => {
      slotsSet.add(`${z.godzinaRozpoczecia}-${z.godzinaZakonczenia}`);
    });
    const slots = Array.from(slotsSet).sort();

    return slots.map((slot) => {
      const [start, end] = slot.split("-");
      const byDay: Record<number, ZajeciaDto | null> = {};
      dniOdPonDoPia.forEach((d) => {
        byDay[d.value] =
          filteredZajecia.find(
            (z) =>
              z.dzienTygodnia === d.value &&
              z.godzinaRozpoczecia === start &&
              z.godzinaZakonczenia === end
          ) ?? null;
      });
      return { slot, start, end, byDay };
    });
  }, [filteredZajecia]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Ładowanie zajęć...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Góra: przycisk + wybór planu (BEZ "Wszystkie plany") */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!selectedPlanId}
        >
          Dodaj zajęcia
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Plan:</span>
          <select
            value={selectedPlanId}
            onChange={(e) =>
              setSelectedPlanId(
                e.target.value ? Number(e.target.value) : ""
              )
            }
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled={loading || plany.length === 0}
          >
            {plany.map((p) => (
              <option key={p.id} value={p.id}>
                {p.klasaNazwa} Sem{p.semestrNazwa}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info jeśli brak wybranego planu */}
      {!selectedPlanId && plany.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <p className="text-sm text-yellow-800">
            Wybierz plan, aby zobaczyć zajęcia.
          </p>
        </div>
      )}

      {/* Widok tygodnia Pon–Pt */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Godzina
                </th>
                {dniOdPonDoPia.map((d) => (
                  <th
                    key={d.value}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(!selectedPlanId || timetableRows.length === 0) && (
                <tr>
                  <td
                    colSpan={1 + dniOdPonDoPia.length}
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    {selectedPlanId 
                      ? "Brak zajęć dla wybranego planu." 
                      : "Wybierz plan aby zobaczyć zajęcia."
                    }
                  </td>
                </tr>
              )}

              {timetableRows.map((row) => (
                <tr key={row.slot}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {row.start} - {row.end}
                  </td>

                  {dniOdPonDoPia.map((d) => {
                    const z = row.byDay[d.value];
                    if (!z) {
                      return (
                        <td
                          key={d.value}
                          className="px-4 py-2 text-sm text-gray-400 align-top"
                        >
                          -
                        </td>
                      );
                    }

                    return (
                      <td
                        key={d.value}
                        className="px-4 py-2 text-sm text-gray-900 align-top"
                      >
                        <div className="font-medium">
                          {z.przedmiotNazwa ?? z.przedmiotId}
                        </div>
                        <div className="text-xs text-gray-600">
                          {z.nauczycielImieNazwisko ?? z.nauczycielId}
                        </div>
                        <div className="text-xs text-gray-600">
                          Sala: {z.salaNazwa ?? z.salaId}
                        </div>
                        <div className="mt-1 space-x-2">
                          <button
                            onClick={() => handleEditStart(z)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Edytuj
                          </button>
                          <button
                            onClick={() => handleDelete(z.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Usuń
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DODAWANIA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Dodaj zajęcia
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetAddForm();
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Godzina rozpoczęcia
                </label>
                <input
                  type="time"
                  value={nowaGodzinaStart}
                  onChange={(e) => setNowaGodzinaStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Godzina zakończenia
                </label>
                <input
                  type="time"
                  value={nowaGodzinaKoniec}
                  onChange={(e) => setNowaGodzinaKoniec(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dzień tygodnia
                </label>
                <select
                  value={nowyDzienTygodnia}
                  onChange={(e) =>
                    setNowyDzienTygodnia(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz dzień</option>
                  {dniOdPonDoPia.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={nowyPlanId}
                  onChange={(e) =>
                    setNowyPlanId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz plan</option>
                  {plany.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.klasaNazwa} Sem{p.semestrNazwa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Przedmiot
                </label>
                <select
                  value={nowyPrzedmiotId}
                  onChange={(e) =>
                    setNowyPrzedmiotId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz przedmiot</option>
                  {przedmioty.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nazwa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nauczyciel
                </label>
                <select
                  value={nowyNauczycielId}
                  onChange={(e) =>
                    setNowyNauczycielId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz nauczyciela</option>
                  {nauczyciele.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.imie} {n.nazwisko}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sala
                </label>
                <select
                  value={nowaSalaId}
                  onChange={(e) =>
                    setNowaSalaId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz salę</option>
                  {sale.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.numer}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetAddForm();
                }}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDYCJI */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Edytuj zajęcia
              </h2>
              <button
                onClick={handleEditCancel}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Godzina rozpoczęcia
                </label>
                <input
                  type="time"
                  value={editGodzinaStart}
                  onChange={(e) => setEditGodzinaStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Godzina zakończenia
                </label>
                <input
                  type="time"
                  value={editGodzinaKoniec}
                  onChange={(e) => setEditGodzinaKoniec(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dzień tygodnia
                </label>
                <select
                  value={editDzienTygodnia}
                  onChange={(e) =>
                    setEditDzienTygodnia(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz dzień</option>
                  {dniOdPonDoPia.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={editPlanId}
                  onChange={(e) =>
                    setEditPlanId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz plan</option>
                  {plany.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.klasaNazwa} Sem{p.semestrNazwa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Przedmiot
                </label>
                <select
                  value={editPrzedmiotId}
                  onChange={(e) =>
                    setEditPrzedmiotId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz przedmiot</option>
                  {przedmioty.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nazwa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nauczyciel
                </label>
                <select
                  value={editNauczycielId}
                  onChange={(e) =>
                    setEditNauczycielId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz nauczyciela</option>
                  {nauczyciele.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.imie} {n.nazwisko}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sala
                </label>
                <select
                  value={editSalaId}
                  onChange={(e) =>
                    setEditSalaId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz salę</option>
                  {sale.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.numer}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                onClick={handleEditSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZajeciaList;
