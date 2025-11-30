// pages/teacher/FrekwencjaNauczyciel.tsx - WERSJA Z LICZBAMI

import React, { useState, useEffect, useMemo } from 'react';
import { 
  getUczniowieDlaZajec, 
  getFrekwencjaByZajeciaAndDate, 
  updateFrekwencja, 
  createFrekwencja, 
  getZajeciaNauczyciela 
} from '../../api/FrekwencjaService';
import { Uzytkownik } from '../../types/Uzytkownik'; 
import { 
  FrekwencjaCreateDto, 
  StatusFrekwencji, 
  getPolishStatusName,
  ALL_STATUSES 
} from '../../types/Frekwencja';
import { UczenFrekwencja, ZajeciaDetails } from '../../types/Zajecia';

interface FrekwencjaRowState extends UczenFrekwencja {
  status: StatusFrekwencji; // Liczba 0-3
  frekwencjaId?: number;
  isDirty: boolean;
}

const getStatusColor = (status: StatusFrekwencji) => {
  switch (status) {
    case StatusFrekwencji.OBECNY: 
      return 'text-green-600 bg-green-50 border-green-200';
    case StatusFrekwencji.NIEOBECNY: 
      return 'text-red-600 bg-red-50 border-red-200';
    case StatusFrekwencji.SPOZNIONY: 
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case StatusFrekwencji.USPRAWIEDLIWIONY: 
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default: 
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export default function FrekwencjaNauczyciel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [zajeciaList, setZajeciaList] = useState<ZajeciaDetails[]>([]);
  const [selectedZajeciaId, setSelectedZajeciaId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [rows, setRows] = useState<FrekwencjaRowState[]>([]);
  
  const user: Uzytkownik = useMemo(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : { id: 1, imie: "Jan", nazwisko: "Kowalski" };
  }, []);
  
  useEffect(() => {
    async function loadZajecia() {
      try {
        const data = await getZajeciaNauczyciela(user.id);
        setZajeciaList(data);
        if (data.length > 0) {
          setSelectedZajeciaId(data[0].id);
        }
      } catch (err: any) {
        setError("Nie udało się pobrać listy zajęć.");
      }
    }
    loadZajecia();
  }, [user.id]);
  
  useEffect(() => {
    if (!selectedZajeciaId) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [uczniowie, existingFrekwencja] = await Promise.all([
          getUczniowieDlaZajec(selectedZajeciaId!),
          getFrekwencjaByZajeciaAndDate(selectedZajeciaId!, selectedDate)
        ]);
        
        const mergedData: FrekwencjaRowState[] = uczniowie.map((uczen: UczenFrekwencja) => { 
          const existingRecord = existingFrekwencja.find((f: any) => f.uczenId === uczen.id);
          
          return {
            ...uczen,
            status: existingRecord ? existingRecord.status : StatusFrekwencji.OBECNY, // = 1
            frekwencjaId: existingRecord ? existingRecord.id : undefined,
            isDirty: false
          };
        });

        mergedData.sort((a, b) => a.nazwisko.localeCompare(b.nazwisko));
        setRows(mergedData);
      } catch (err: any) {
        console.error(err);
        setError("Wystąpił błąd podczas pobierania listy obecności.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedZajeciaId, selectedDate]);

  const handleStatusChange = (uczenId: number, newStatus: StatusFrekwencji) => {
    setRows(prev => prev.map(row => 
      row.id === uczenId ? { ...row, status: newStatus, isDirty: true } : row
    ));
  };

  const markAllPresent = () => {
    setRows(prev => prev.map(row => ({ 
      ...row, 
      status: StatusFrekwencji.OBECNY, // = 1
      isDirty: true 
    })));
  };

  const handleSave = async () => {
    if (!selectedZajeciaId) return;
    setSaving(true);
    
    try {
      const promises = rows.map(async (row) => {
        const dto: FrekwencjaCreateDto = {
          data: selectedDate,
          status: row.status, // Wysyła liczbę (0, 1, 2, 3)
          uczenId: row.id,
          zajeciaId: selectedZajeciaId,
        };

        if (row.frekwencjaId) {
          await updateFrekwencja(row.frekwencjaId, { status: row.status, data: selectedDate });
        } else {
          await createFrekwencja(dto);
        }
      });

      await Promise.all(promises);
      alert("Zapisano pomyślnie!");
      window.location.reload(); 
    } catch (err: any) {
      alert("Błąd zapisu: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) return (
    <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {error}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dziennik Lekcyjny</h1>
        <p className="text-gray-500">Panel sprawdzania obecności</p>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <label className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700 mb-1">Data zajęć</span>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700 mb-1">Wybierz przedmiot i klasę</span>
          <select 
            value={selectedZajeciaId ?? ''}
            onChange={(e) => setSelectedZajeciaId(Number(e.target.value))}
            className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            disabled={zajeciaList.length === 0}
          >
             {zajeciaList.length === 0 ? <option>Brak zajęć</option> : null}
             {zajeciaList.map(z => (
               <option key={z.id} value={z.id}>
                 {z.przedmiot} — Klasa {z.grupa || 'A'} ({z.godzina})
               </option>
             ))}
          </select>
        </label>

        <div className="flex justify-end pb-1">
            <button 
                onClick={markAllPresent}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                disabled={loading || rows.length === 0}
            >
                Zaznacz wszystkich obecnych
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Ładowanie listy uczniów...</div>
        ) : rows.length === 0 ? (
           <div className="p-10 text-center text-gray-500">Brak uczniów przypisanych do tych zajęć.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">Lp.</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Uczeń</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status obecności</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-sm">
                    {index + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {row.imie[0]}{row.nazwisko[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{row.nazwisko} {row.imie}</span>
                        <span className="text-xs text-gray-400">ID: {row.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-block relative">
                        {/* ✅ WAŻNE: Number(e.target.value) konwertuje string na liczbę */}
                        <select 
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, Number(e.target.value) as StatusFrekwencji)}
                        className={`appearance-none py-2 pl-3 pr-8 rounded-lg text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${getStatusColor(row.status)}`}
                        >
                            {ALL_STATUSES.map(status => (
                              <option key={status} value={status}>
                                {getPolishStatusName(status)}
                              </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={loading || saving || rows.length === 0}
          className={`
            px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition-all
            ${saving || loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'
            }
          `}
        >
          {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </button>
      </div>
    </div>
  );
}