// src/pages/student/FrekwencjaUczen.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  pobierzFrekwencjeUcznia,
  FrekwencjaUczniaResponseDto,
  FrekwencjaUczniaDto,
  StatystykiFrekwencjiDto,
} from "../../api/PanelUczniaService";

interface FrekwencjaUczenProps {
  uczenId: number;
}

const FrekwencjaUczen: React.FC<FrekwencjaUczenProps> = ({ uczenId }) => {
  const [frekwencja, setFrekwencja] = useState<FrekwencjaUczniaDto[]>([]);
  const [statystyki, setStatystyki] = useState<StatystykiFrekwencjiDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataOd, setDataOd] = useState<string>("");
  const [dataDo, setDataDo] = useState<string>("");

  // Domyślne daty
  const todayISO = (): string => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };



  const lastWeek = (): string => {
    const now = new Date();
  const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  return lastWeek.toISOString().slice(0, 10); // "2026-01-01"
};
const rokSzkolnyStart = (): string => {
  const now = new Date();
  const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;

  const date = new Date(year, 8, 1);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};



  const loadFrekwencja = useCallback(async () => {
    try {
      console.log("📊 Pobieram frekwencję:", uczenId, dataOd || "auto", "→", dataDo || "auto");
      const frekwencjaRes = await pobierzFrekwencjeUcznia(uczenId, dataOd || undefined, dataDo || undefined);
      console.log("✅ Frekwencja:", frekwencjaRes);
      setFrekwencja(frekwencjaRes.frekwencje);
      setStatystyki(frekwencjaRes.statystyki);
    } catch (error) {
      console.error("❌ Błąd frekwencji:", error);
    } finally {
      setLoading(false);
    }
  }, [uczenId, dataOd, dataDo]);

  // Ustaw domyślne daty przy pierwszym ładowaniu
  useEffect(() => {
    if (!dataOd && !dataDo) {
      setDataOd(rokSzkolnyStart());
      setDataDo(todayISO());
    }
  }, []);

  useEffect(() => {
    if (dataOd && dataDo) {
      loadFrekwencja();
    }
  }, [loadFrekwencja]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { className: string; label: string }> = {
      "OBECNY": { className: "bg-green-100 text-green-800", label: "Obecny" },
      "NIEOBECNY": { className: "bg-red-100 text-red-800", label: "Nieobecny" },
      "SPOZNIONY": { className: "bg-yellow-100 text-yellow-800", label: "Spóźniony" },
      "USPRAWIEDLIWIONY": { className: "bg-blue-100 text-blue-800", label: "Usprawiedliwiony" },
    };
    return badges[status] || { className: "bg-gray-100 text-gray-800", label: status };
  };

  const resetDaty = () => {
    setDataOd(rokSzkolnyStart());
    setDataDo(todayISO());
  };

   const resetDaty2 = () => {
    setDataOd(lastWeek());
    setDataDo(todayISO());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Ładowanie frekwencji...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Frekwencja</h2>
        
        {/* Filtry dat */}
        <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Od:</label>
            <input
              type="date"
              value={dataOd}
              onChange={(e) => setDataOd(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Do:</label>
            <input
              type="date"
              value={dataDo}
              onChange={(e) => setDataDo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
              max={todayISO()}
            />
          </div>
          
          <button
            onClick={resetDaty2}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
          >
            📅 Ostatni tydzień
          </button>

          <button
            onClick={resetDaty}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
          >
            📅 Początek semestru
          </button>
        </div>

        {statystyki && (
          <div className="text-sm text-gray-600 mb-4">
            Okres: <span className="font-mono">{dataOd} → {dataDo}</span> | 
            Obecność: <span className="font-semibold text-green-600">{statystyki.procentObecnosci}%</span> | 
            {statystyki.liczbaOgolem} wpisów
          </div>
        )}
      </div>

      {/* Statystyki */}
      {statystyki && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{statystyki.liczbaObecnosci}</div>
            <div className="text-sm text-gray-600 mt-1">Obecności</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{statystyki.liczbaNieobecnosci}</div>
            <div className="text-sm text-gray-600 mt-1">Nieobecności</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{statystyki.liczbaSpoznien}</div>
            <div className="text-sm text-gray-600 mt-1">Spóźnienia</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{statystyki.liczbaUsprawiedliwionych}</div>
            <div className="text-sm text-gray-600 mt-1">Usprawiedliwione</div>
          </div>
        </div>
      )}

      {/* Tabela frekwencji */}
      <div className="bg-white shadow-lg border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Przedmiot
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Godzina
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {frekwencja.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-2xl mb-2">📭</div>
                      <p className="text-lg font-medium">Brak wpisów frekwencji</p>
                      <p className="text-sm mt-1">w okresie {dataOd} - {dataDo}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                frekwencja.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(f.data).toLocaleDateString("pl-PL", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {f.przedmiotNazwa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {f.godzinaRozpoczecia} - {f.godzinaZakonczenia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                        getStatusBadge(f.status).className
                      }`}>
                        {getStatusBadge(f.status).label}
                      </span>
                    </td>
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

export default FrekwencjaUczen;
