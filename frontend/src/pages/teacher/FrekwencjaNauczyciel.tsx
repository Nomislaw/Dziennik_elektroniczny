// pages/teacher/FrekwencjaNauczyciel.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Uzytkownik } from '../../types/Uzytkownik'; 
import { FrekwencjaCreateDto, FrekwencjaDetailsDto, FrekwencjaUpdateDto, StatusFrekwencji } from '../../types/Frekwencja';
import { getUczniowieDlaZajec, getFrekwencjaByZajeciaAndDate, updateFrekwencja, createFrekwencja, getZajeciaNauczyciela } from '../../api/FrekwencjaService';
import { UczenFrekwencja, ZajeciaDetails } from '../../types/Zajecia';


// 1. Zdefiniuj typ dla stanu frekwencji (łączy ucznia z jego statusem)
interface FrekwencjaState extends UczenFrekwencja {
  status: StatusFrekwencji;
  frekwencjaId?: number; // Opcjonalne: ID jeśli rekord już istnieje w bazie
}

export default function FrekwencjaNauczyciel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stan przechowujący wybrane zajęcia (np. Matma, 1A, 8:00)
  const [zajecia, setZajecia] = useState<ZajeciaDetails[]>([]);
  const [selectedZajeciaId, setSelectedZajeciaId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Stan przechowujący listę uczniów z ich statusami frekwencji
  const [frekwencjaData, setFrekwencjaData] = useState<FrekwencjaState[]>([]);
  
  // Mock nauczyciela (W PRAWIDŁOWYM KODZIE POWINIEN PRZYJŚĆ PRZEZ PROPS LUB ZOSTAĆ POBRANY Z LOCALSTORAGE)
  const user: Uzytkownik = useMemo(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : { id: 1, imie: "Mock", nazwisko: "Nauczyciel" }; // Mock ID
  }, []);
  
  // ----------------------------------------------------
  // I. Efekt ładowania zajęć dla nauczyciela
  // ----------------------------------------------------
  useEffect(() => {
    async function loadZajecia() {
      try {
        const loadedZajecia = await getZajeciaNauczyciela(user.id);
        setZajecia(loadedZajecia);
        if (loadedZajecia.length > 0) {
          setSelectedZajeciaId(loadedZajecia[0].id); // Wybierz pierwsze zajęcia domyślnie
        }
      } catch (err: any) {
        setError(`Błąd ładowania zajęć: ${err.message}`);
      }
    }
    loadZajecia();
  }, [user.id]);
  
  // ----------------------------------------------------
  // II. Efekt ładowania uczniów i frekwencji
  // ----------------------------------------------------
  useEffect(() => {
    if (!selectedZajeciaId) return;

    async function loadAttendance() {
      setLoading(true);
      setError(null);
      try {
        // 1. Pobierz uczniów dla wybranych zajęć
        const uczniowie = await getUczniowieDlaZajec(selectedZajeciaId!);
        // 2. Pobierz istniejącą frekwencję dla tej daty i zajęć
        const existingFrekwencja = await getFrekwencjaByZajeciaAndDate(selectedZajeciaId!, selectedDate);
        
        // 3. Połącz dane: uczeń + status
       const combinedData: FrekwencjaState[] = uczniowie.map((uczen: UczenFrekwencja) => { 
          const frek = existingFrekwencja.find((f: FrekwencjaDetailsDto) => f.uczenId === uczen.id); // Typ F już naprawiony
          
          return {
            ...uczen,
            status: frek ? frek.status : "Obecny", 
            frekwencjaId: frek?.id,
          };
        });

        setFrekwencjaData(combinedData);
      } catch (err: any) {
        setError(`Błąd ładowania danych: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [selectedZajeciaId, selectedDate]);


  // ----------------------------------------------------
  // III. Handlery
  // ----------------------------------------------------

  const handleStatusChange = (uczenId: number, newStatus: StatusFrekwencji) => {
    setFrekwencjaData(prevData =>
      prevData.map(f => 
        f.id === uczenId ? { ...f, status: newStatus } : f
      )
    );
  };
  
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!selectedZajeciaId) return;

      const results = frekwencjaData.map(async (f: FrekwencjaState) => {
        const dto: FrekwencjaCreateDto = {
          data: selectedDate,
          status: f.status,
          uczenId: f.id,
          zajeciaId: selectedZajeciaId,
        };

        if (f.frekwencjaId) {
          // Rekord istnieje -> Aktualizuj (PATCH)
          await updateFrekwencja(f.frekwencjaId, { status: f.status });
        } else {
          // Rekord nie istnieje -> Utwórz (POST)
          await createFrekwencja(dto);
        }
      });

      await Promise.all(results);
      alert("Frekwencja zapisana pomyślnie!");
      // Po zapisie, ponownie załaduj dane, aby zaktualizować frekwencjaId
      // (ponowne uruchomienie useEffect II)
      setSelectedZajeciaId(selectedZajeciaId); 

    } catch (err: any) {
      setError(`Błąd zapisu frekwencji: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">Błąd: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 Wystawianie frekwencji</h2>
      
      {/* SEKCJA WYBORU */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex space-x-4 items-center">
        
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Wybierz datę:</span>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded"
            disabled={loading}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Wybierz zajęcia:</span>
          <select 
            value={selectedZajeciaId ?? ''}
            onChange={(e) => setSelectedZajeciaId(Number(e.target.value))}
            className="p-2 border rounded"
            disabled={loading || zajecia.length === 0}
          >
            {zajecia.length === 0 ? (
                <option value="">Brak dostępnych zajęć</option>
            ) : (
                zajecia.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.przedmiot} ({z.grupa}) - {z.godzina}
                  </option>
                ))
            )}
          </select>
        </label>
      </div>

      {/* SEKCJA TABELI FREKWENCJI */}
      <div className="bg-white p-4 rounded-xl shadow">
        
        {loading && <div className="text-center py-8">Ładowanie frekwencji...</div>}
        
        {!loading && frekwencjaData.length > 0 && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 border text-left">L.p.</th>
                <th className="p-3 border text-left">Uczeń</th>
                <th className="p-3 border text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {frekwencjaData.map((f, index) => (
                <tr key={f.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="border p-3 w-10">{index + 1}</td>
                  <td className="border p-3 font-medium">{f.imie} {f.nazwisko}</td>
                  <td className="border p-3 text-center w-40">
                    <select 
                      value={f.status} 
                      onChange={(e) => handleStatusChange(f.id, e.target.value as StatusFrekwencji)}
                      className="p-1 border rounded"
                    >
                      {/* Generujemy opcje na podstawie StatusFrekwencji */}
                      {['Obecny', 'Nieobecny', 'Spóźnienie', 'Usprawiedliwiony', 'Nieusprawiedliwiony'].map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button 
          onClick={handleSave}
          className="bg-purple-600 text-white mt-4 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          disabled={loading || !selectedZajeciaId || frekwencjaData.length === 0}
        >
          {loading ? "Zapisywanie..." : "Zapisz frekwencję"}
        </button>
      </div>
    </div>
  );
}