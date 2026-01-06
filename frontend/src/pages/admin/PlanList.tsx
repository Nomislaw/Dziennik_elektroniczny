import React, { useState, useEffect } from "react";
import {
  pobierzPlany,
  dodajPlan,
  usunPlan,
  edytujPlan,
} from "../../api/PlanService";
import { pobierzKlasa } from "../../api/KlasaService";
import { pobierzSemestry } from "../../api/SemestrService";

// dostosowane do camelCase z JSON
export interface PlanDto {
  id: number;
  klasaId: number;
  klasaNazwa: string;
  semestrId: number;
  semestrNazwa: string;
}

export interface PlanCreateDto {
  klasaId: number;
  semestrId: number;
}

export interface PlanUpdateDto {
  klasaId?: number;
  semestrId?: number;
}

interface Klasa {
  id: number;
  nazwa: string;
}

interface Semestr {
  id: number;
  dataRozpoczecia: string;
  dataZakonczenia: string;
  numer: number;
}

const PlanList: React.FC = () => {
  const [plany, setPlany] = useState<PlanDto[]>([]);
  const [klasy, setKlasy] = useState<Klasa[]>([]);
  const [semestry, setSemestry] = useState<Semestr[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [nowyPlanKlasaId, setNowyPlanKlasaId] = useState<number | "">("");
  const [nowyPlanSemestrId, setNowyPlanSemestrId] = useState<number | "">("");

  const [edytowanyPlanKlasaId, setEdytowanyPlanKlasaId] = useState<
    number | ""
  >("");
  const [edytowanyPlanSemestrId, setEdytowanyPlanSemestrId] = useState<
    number | ""
  >("");

  useEffect(() => {
    const load = async () => {
      try {
        const [planyRes, klasyRes, semestryRes] = await Promise.all([
          pobierzPlany(),      // -> PlanDto[] z polami camelCase
          pobierzKlasa(),
          pobierzSemestry(),
        ]);
        setPlany(planyRes);
        setKlasy(klasyRes);
        setSemestry(semestryRes);
      } catch (error) {
        console.error("Błąd podczas ładowania danych planów:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadPlany = async () => {
    try {
      const data = await pobierzPlany();
      setPlany(data);
    } catch (error) {
      console.error("Błąd podczas odświeżania planów:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten plan?")) return;

    try {
      await usunPlan(id);
      setPlany((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Błąd podczas usuwania planu:", error);
      alert("Nie udało się usunąć planu");
    }
  };

  const handleEditStart = (plan: PlanDto) => {
    setEditingId(plan.id);
    setEdytowanyPlanKlasaId(plan.klasaId);
    setEdytowanyPlanSemestrId(plan.semestrId);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEdytowanyPlanKlasaId("");
    setEdytowanyPlanSemestrId("");
  };

  const handleEditSave = async (id: number) => {
    if (edytowanyPlanKlasaId === "" || edytowanyPlanSemestrId === "") {
      return alert("Wybierz klasę i semestr");
    }

    try {
      const payload: PlanUpdateDto = {
        klasaId: Number(edytowanyPlanKlasaId),
        semestrId: Number(edytowanyPlanSemestrId),
      };
      await edytujPlan(id, payload);
      setEditingId(null);
      await loadPlany();
    } catch (error) {
      console.error("Błąd podczas aktualizacji planu:", error);
      alert("Nie udało się zaktualizować planu");
    }
  };

  const handleAdd = async () => {
    if (nowyPlanKlasaId === "" || nowyPlanSemestrId === "") {
      return alert("Wybierz klasę i semestr");
    }

    try {
      const payload: PlanCreateDto = {
        klasaId: Number(nowyPlanKlasaId),
        semestrId: Number(nowyPlanSemestrId),
      };
      await dodajPlan(payload);
      setNowyPlanKlasaId("");
      setNowyPlanSemestrId("");
      await loadPlany();
    } catch (error) {
      console.error("Błąd podczas dodawania planu:", error);
      alert("Nie udało się dodać planu");
    }
  };

  const getSemestrLabel = (s: Semestr) =>
    `${s.numer}. semestr (${s.dataRozpoczecia.substring(
      0,
      10
    )} - ${s.dataZakonczenia.substring(0, 10)})`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Ładowanie planów...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Dodawanie nowego planu */}
      <div className="bg-white shadow-sm border rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dodaj plan</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Klasa
            </label>
            <select
              value={nowyPlanKlasaId}
              onChange={(e) =>
                setNowyPlanKlasaId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Wybierz klasę</option>
              {klasy.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nazwa}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semestr
            </label>
            <select
              value={nowyPlanSemestrId}
              onChange={(e) =>
                setNowyPlanSemestrId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Wybierz semestr</option>
              {semestry.map((s) => (
                <option key={s.id} value={s.id}>
                  {getSemestrLabel(s)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors h-10 self-end"
            >
              Dodaj plan
            </button>
          </div>
        </div>
      </div>

      {/* Lista planów */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Klasa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semestr
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plany.map((plan) => (
                <tr
                  key={plan.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plan.id}
                  </td>

                  {/* Klasa */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === plan.id ? (
                      <select
                        value={edytowanyPlanKlasaId}
                        onChange={(e) =>
                          setEdytowanyPlanKlasaId(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="px-2 py-1 border border-gray-300 rounded-md"
                      >
                        <option value="">Wybierz klasę</option>
                        {klasy.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.nazwa}
                          </option>
                        ))}
                      </select>
                    ) : (
                      plan.klasaNazwa
                    )}
                  </td>

                  {/* Semestr */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === plan.id ? (
                      <select
                        value={edytowanyPlanSemestrId}
                        onChange={(e) =>
                          setEdytowanyPlanSemestrId(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="px-2 py-1 border border-gray-300 rounded-md"
                      >
                        <option value="">Wybierz semestr</option>
                        {semestry.map((s) => (
                          <option key={s.id} value={s.id}>
                            {getSemestrLabel(s)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      plan.semestrNazwa
                    )}
                  </td>

                  {/* Akcje */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {editingId === plan.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(plan.id)}
                          className="text-green-600 hover:text-green-900 px-2 py-1 rounded-md hover:bg-green-50 transition-colors"
                        >
                          Zapisz
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          Anuluj
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(plan)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                          title="Edytuj"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="Usuń"
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {plany.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Brak planów w bazie.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanList;
