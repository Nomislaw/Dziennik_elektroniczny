// src/pages/student/PlanLekcjiUczen.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  pobierzPlanLekcjiUcznia,
  PlanLekcjiResponseDto,
  ZajeciaUczniaDto,
} from "../../api/PanelUczniaService";

const dniTygodnia: { value: number; label: string }[] = [
  { value: 1, label: "Poniedziałek" },
  { value: 2, label: "Wtorek" },
  { value: 3, label: "Środa" },
  { value: 4, label: "Czwartek" },
  { value: 5, label: "Piątek" },
];

interface PlanLekcjiUczenProps {
  uczenId: number;
}

const PlanLekcjiUczen: React.FC<PlanLekcjiUczenProps> = ({ uczenId }) => {
  const [plan, setPlan] = useState<PlanLekcjiResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPlan = useCallback(async () => {
    try {
      console.log("📅 Pobieram plan lekcji dla ucznia:", uczenId);
      const planRes = await pobierzPlanLekcjiUcznia(uczenId);
      console.log("✅ Plan:", planRes);
      setPlan(planRes);
    } catch (error) {
      console.error("❌ Błąd planu:", error);
    } finally {
      setLoading(false);
    }
  }, [uczenId]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const timetableRows = React.useMemo(() => {
    if (!plan?.zajecia.length) return [];

    const slotsSet = new Set<string>();
    plan.zajecia.forEach((z) => {
      slotsSet.add(`${z.godzinaRozpoczecia}-${z.godzinaZakonczenia}`);
    });
    const slots = Array.from(slotsSet).sort();

    return slots.map((slot) => {
      const [start, end] = slot.split("-");
      const byDay: Record<number, ZajeciaUczniaDto | null> = {};
      
      dniTygodnia.forEach((d) => {
        byDay[d.value] = plan.zajecia.find(
          (z) => z.dzienTygodnia === d.value && // Zakładamy że ZajeciaUczniaDto ma to pole
            z.godzinaRozpoczecia === start &&
            z.godzinaZakonczenia === end
        ) ?? null;
      });
      
      return { slot, start, end, byDay };
    });
  }, [plan]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Ładowanie planu lekcji...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📚 Plan lekcji</h2>
        <p className="text-sm text-gray-600 mt-1">
          Klasa: <span className="font-medium">{plan?.klasaNazwa ?? "Brak"}</span>
          {" | "}
          {plan?.zajecia.length ?? 0} zajęć
        </p>
      </div>

      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Godzina
                </th>
                {dniTygodnia.map((d) => (
                  <th key={d.value} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timetableRows.length === 0 ? (
                <tr>
                  <td colSpan={1 + dniTygodnia.length} className="px-6 py-12 text-center text-sm text-gray-500">
                    Brak zaplanowanych zajęć
                  </td>
                </tr>
              ) : (
                timetableRows.map((row) => (
                  <tr key={row.slot}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {row.start} - {row.end}
                    </td>
                    {dniTygodnia.map((d) => {
                      const z = row.byDay[d.value];
                      if (!z) {
                        return (
                          <td key={d.value} className="px-6 py-4 text-sm text-gray-400">
                            —
                          </td>
                        );
                      }
                      return (
                        <td key={d.value} className="px-6 py-4">
                          <div className="font-medium text-gray-900 mb-1">{z.przedmiotNazwa}</div>
                          <div className="text-sm text-gray-600 mb-1">{z.nauczycielImieNazwisko}</div>
                          <div className="text-xs text-gray-500">Sala: {z.salaNumer}</div>
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
    </div>
  );
};

export default PlanLekcjiUczen;
