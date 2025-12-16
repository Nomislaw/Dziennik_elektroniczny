import { useEffect, useState } from "react";
import { pobierzNauczycieli, usunUzytkownika, dodajNauczyciela, edytujNauczyciela, pobierzKlasy, zmienRoleUzytkownika, aktywujUzytkownika,
  wyslijTokenUzytkownika,dezaktywujUzytkownika } from "../../api/UzytkownikService";

type Nauczyciel = {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
   rola: "Administrator" | "Nauczyciel" | "Rodzic" | "Uczen";
  czyEmailPotwierdzony: boolean;
  czyWychowawca: boolean;
  wychowawstwoKlasaId?: number;
  wychowawstwoKlasaNazwa?: string;
  prowadzonePrzedmioty?: string[];
  liczbaWystawionychOcen?: number;
};

type ViewMode = "list" | "add" | "edit" | "details";

export default function NauczycieleList() {
  const [nauczyciele, setNauczyciele] = useState<Nauczyciel[]>([]);
  const [klasy, setKlasy] = useState<{ id: number; nazwa: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedNauczyciel, setSelectedNauczyciel] = useState<Nauczyciel | null>(null);
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
    hasloPowtorz: "",
    wychowawstwoKlasaId: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [nauczycieleData, klasyData] = await Promise.all([
        pobierzNauczycieli(),
        pobierzKlasy(),
      ]);
      setNauczyciele(nauczycieleData);
      setKlasy(klasyData);
    } catch (err) {
      console.error("Błąd ładowania danych:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego nauczyciela?")) return;
    try {
      await usunUzytkownika(id.toString());
      setNauczyciele((prev) => prev.filter((n) => n.id !== id));
      alert("Nauczyciel został usunięty.");
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć nauczyciela.");
    }
  };

  const handleAdd = async () => {
    if (!formData.imie || !formData.nazwisko || !formData.email || !formData.haslo || !formData.hasloPowtorz) {
      alert("Wypełnij wszystkie wymagane pola!");
      return;
    }
    if (formData.haslo !== formData.hasloPowtorz) {
  alert("Hasła nie są identyczne!");
  return;
}


    try {
      await dodajNauczyciela({
        ...formData,
        wychowawstwoKlasaId: formData.wychowawstwoKlasaId || undefined,
      });
      alert("Nauczyciel został dodany.");
      loadData();
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err || "Nie udało się dodać nauczyciela.");
    }
  };

  const handleEdit = async () => {
    if (!selectedNauczyciel) return;

    try {
      await edytujNauczyciela(selectedNauczyciel.id.toString(), {
        imie: formData.imie,
        nazwisko: formData.nazwisko,
        email: formData.email,
        wychowawstwoKlasaId: formData.wychowawstwoKlasaId || undefined,
      });
      alert("Nauczyciel został zaktualizowany.");
      loadData();
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Nie udało się edytować nauczyciela.");
    }
  };

  const openEditMode = (nauczyciel: Nauczyciel) => {
    setSelectedNauczyciel(nauczyciel);
    setFormData({
      imie: nauczyciel.imie,
      nazwisko: nauczyciel.nazwisko,
      email: nauczyciel.email,
      haslo: "",
      hasloPowtorz: "",
      wychowawstwoKlasaId: nauczyciel.wychowawstwoKlasaId || 0,
    });
    setViewMode("edit");
  };

  const handleRoleChange = async (id: number, nowaRola: string) => {
      try {
        await zmienRoleUzytkownika(id.toString(), nowaRola);
        setNauczyciele((prev) =>
          prev.map((a) => (a.id === id ? { ...a, rola: nowaRola as any } : a))
        );
        alert("Rola została zmieniona.");
        loadData();
      } catch (err: any) {
        console.error(err);
        alert(err?.message || "Nie udało się zmienić roli.");
      }
    };
  const handleActiveUser = async (id: number) => {
    const user = nauczyciele.find((u) => u.id === id);
    if (!user) return;

    if (!window.confirm("Na pewno chcesz aktywować to konto?")) return;

    try {
      await aktywujUzytkownika(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas aktywowania użytkownika");
    }
  };

   const handleDeactiveUser = async (id: number) => {
    const user = nauczyciele.find((u) => u.id === id);
    if (!user) return;

    if (!window.confirm("Na pewno chcesz dezaktywować to konto?")) return;

    try {
      await dezaktywujUzytkownika(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dezaktywowania użytkownika");
    }
  };


  const handleSendTokenToUser = async (id: number) => {
    const user = nauczyciele.find((u) => u.id === id);
    if (!user) return;

    if (!window.confirm("Na pewno chcesz wysłać token do użytkownika?")) return;

    try {
      await wyslijTokenUzytkownika(id);
      alert("Wysłano token pomyślnie!");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas wysyłania tokenu do użytkownika");
    }
  };

  const resetForm = () => {
  setFormData({ imie: "", nazwisko: "", email: "", haslo: "", hasloPowtorz: "", wychowawstwoKlasaId: 0 });
  setSelectedNauczyciel(null);
};


  if (loading) return <p>Ładowanie danych...</p>;

  return (
    <div>
      {viewMode === "list" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lista nauczycieli ({nauczyciele.length})</h2>
            <button
              onClick={() => setViewMode("add")}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              ➕ Dodaj nauczyciela
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imię i nazwisko</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rola</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wychowawstwo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {nauczyciele.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{n.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{n.imie} {n.nazwisko}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{n.email}</td>
              
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={n.rola}
                        onChange={(e) => handleRoleChange(n.id, e.target.value)}
                        className="border rounded-lg px-2 py-1"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Nauczyciel">Nauczyciel</option>
                        <option value="Rodzic">Rodzic</option>
                        <option value="Uczen">Uczeń</option>
                      </select>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {n.czyWychowawca ? (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          👨‍🏫 {n.wychowawstwoKlasaNazwa}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {n.czyEmailPotwierdzony ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✓ Potwierdzony</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">⏳ Niepotwierdzony</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => { setSelectedNauczyciel(n); setViewMode("details"); }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        👁 Zobacz
                      </button>
                      <button
                        onClick={() => openEditMode(n)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        ✏️ Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑 Usuń
                      </button>
                      {n.czyEmailPotwierdzony === true && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleDeactiveUser(n.id)}
                          >
                            ❌ Dezaktywuj
                          </button>
                        )}
                       {n.czyEmailPotwierdzony === false && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleActiveUser(n.id)}
                          >
                            ✅ Aktywuj
                          </button>
                        )}

                        {n.czyEmailPotwierdzony === false && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleSendTokenToUser(n.id)}
                          >
                            📩 Wyślij token
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {viewMode === "add" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Dodaj nowego nauczyciela</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Imię *"
              value={formData.imie}
              onChange={(e) => setFormData({ ...formData, imie: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Nazwisko *"
              value={formData.nazwisko}
              onChange={(e) => setFormData({ ...formData, nazwisko: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              type="password"
              placeholder="Hasło *"
              value={formData.haslo}
              onChange={(e) => setFormData({ ...formData, haslo: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              type="password"
              placeholder="Powtórz hasło *"
              value={formData.hasloPowtorz}
              onChange={(e) => setFormData({ ...formData, hasloPowtorz: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />

            <select
              value={formData.wychowawstwoKlasaId}
              onChange={(e) => setFormData({ ...formData, wychowawstwoKlasaId: Number(e.target.value) })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value={0}>Brak wychowawstwa (opcjonalne)</option>
              {klasy.map((k) => (
                <option key={k.id} value={k.id}>{k.nazwa}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500">* - pola wymagane</p>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              💾 Zapisz
            </button>
            <button
              onClick={() => { setViewMode("list"); resetForm(); }}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              🔙 Anuluj
            </button>
            
          </div>
        </div>
      )}

      {viewMode === "edit" && selectedNauczyciel && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Edytuj nauczyciela</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Imię"
              value={formData.imie}
              onChange={(e) => setFormData({ ...formData, imie: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Nazwisko"
              value={formData.nazwisko}
              onChange={(e) => setFormData({ ...formData, nazwisko: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <select
              value={formData.wychowawstwoKlasaId}
              onChange={(e) => setFormData({ ...formData, wychowawstwoKlasaId: Number(e.target.value) })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value={0}>Brak wychowawstwa</option>
              {klasy.map((k) => (
                <option key={k.id} value={k.id}>{k.nazwa}</option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              💾 Zapisz zmiany
            </button>
            <button
              onClick={() => { setViewMode("list"); resetForm(); }}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              🔙 Anuluj
            </button>
          </div>
        </div>
      )}

      {viewMode === "details" && selectedNauczyciel && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Szczegóły nauczyciela</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedNauczyciel.id}</p>
            <p><strong>Imię:</strong> {selectedNauczyciel.imie}</p>
            <p><strong>Nazwisko:</strong> {selectedNauczyciel.nazwisko}</p>
            <p><strong>Email:</strong> {selectedNauczyciel.email}</p>
            <p><strong>Wychowawca:</strong> {selectedNauczyciel.czyWychowawca ? `Tak (${selectedNauczyciel.wychowawstwoKlasaNazwa})` : "Nie"}</p>
            <p><strong>Email potwierdzony:</strong> {selectedNauczyciel.czyEmailPotwierdzony ? "Tak ✓" : "Nie ✗"}</p>
            {selectedNauczyciel.prowadzonePrzedmioty && selectedNauczyciel.prowadzonePrzedmioty.length > 0 && (
              <div>
                <strong>Prowadzone przedmioty:</strong>
                <ul className="list-disc ml-6">
                  {selectedNauczyciel.prowadzonePrzedmioty.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedNauczyciel.liczbaWystawionychOcen !== undefined && (
              <p><strong>Liczba wystawionych ocen:</strong> {selectedNauczyciel.liczbaWystawionychOcen}</p>
            )}
          </div>
          <button
            onClick={() => setViewMode("list")}
            className="mt-4 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            🔙 Wróć
          </button>
        </div>
      )}
    </div>
  );
}