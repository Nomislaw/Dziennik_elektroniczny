import { useEffect, useState } from "react";
import {
  pobierzNauczycieli,
  usunUzytkownika,
  dodajNauczyciela,
  edytujNauczyciela,
  pobierzKlasy,
  zmienRoleUzytkownika,
  aktywujUzytkownika,
  dezaktywujUzytkownika,
  wyslijTokenUzytkownika
} from "../../api/UzytkownikService";
import { pobierzPrzedmioty } from "../../api/PrzedmiotService";

type KlasaItem = { id: number; nazwa: string };
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
  klasy?: KlasaItem[];
  klasyIds?: number[];
  przedmioty?: KlasaItem[];
  przedmiotyIds?: number[];
};

type Klasa = { id: number; nazwa: string };
type Przedmiot = { id: number; nazwa: string };
type ViewMode = "list" | "add" | "edit" | "details";

export default function NauczycieleList() {
  const [nauczyciele, setNauczyciele] = useState<Nauczyciel[]>([]);
  const [klasy, setKlasy] = useState<Klasa[]>([]);
  const [przedmioty, setPrzedmioty] = useState<Przedmiot[]>([]);
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
    klasyIds: [] as number[],
    przedmiotyIds: [] as number[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [nauczycieleData, klasyData, przedmiotyData] = await Promise.all([
        pobierzNauczycieli(),
        pobierzKlasy(),
        pobierzPrzedmioty(),
      ]);
      setNauczyciele(nauczycieleData);
      setKlasy(klasyData);
      setPrzedmioty(przedmiotyData);
    } catch (err) {
      console.error("Błąd ładowania danych:", err);
      alert("Błąd podczas ładowania danych");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: number, nowaRola: string) => {
    try {
      await zmienRoleUzytkownika(id.toString(), nowaRola);
      setNauczyciele((prev) =>
        prev.map((n) => (n.id === id ? { ...n, rola: nowaRola as any } : n))
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
        imie: formData.imie,
        nazwisko: formData.nazwisko,
        email: formData.email,
        haslo: formData.haslo,
        wychowawstwoKlasaId: formData.wychowawstwoKlasaId || undefined,
        klasyIds: formData.klasyIds,
        przedmiotyIds: formData.przedmiotyIds,
      });
      alert("Nauczyciel został dodany.");
      loadData();
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Nie udało się dodać nauczyciela.");
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
        klasyIds: formData.klasyIds,
        przedmiotyIds: formData.przedmiotyIds,
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
      klasyIds: nauczyciel.klasyIds || [],
      przedmiotyIds: nauczyciel.przedmiotyIds || [],
    });
    setViewMode("edit");
  };

  const toggleSelect = (id: number, type: "klasyIds" | "przedmiotyIds") => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter((x) => x !== id)
        : [...prev[type], id],
    }));
  };

  const resetForm = () => {
    setFormData({
      imie: "",
      nazwisko: "",
      email: "",
      haslo: "",
      hasloPowtorz: "",
      wychowawstwoKlasaId: 0,
      klasyIds: [],
      przedmiotyIds: [],
    });
    setSelectedNauczyciel(null);
  };

  if (loading) return <p>Ładowanie danych...</p>;

  return (
    <div>
      {/* LISTA NAUCZYCIELI */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klasy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Przedmioty</th>
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
                    <td className="px-6 py-4 text-sm">
                      {n.czyWychowawca ? "👩‍🏫 " + n.wychowawstwoKlasaNazwa : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {n.klasy && n.klasy.length > 0 ? (
                        <div className="space-y-1">
                          {n.klasy.map((k) => (
                            <div key={k.id} className="text-xs">
                              📚 {k.nazwa}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {n.przedmioty && n.przedmioty.length > 0 ? (
                        <div className="space-y-1">
                          {n.przedmioty.map((p) => (
                            <div key={p.id} className="text-xs">
                              📖 {p.nazwa}
                            </div>
                          ))}
                        </div>
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
                      {!n.czyEmailPotwierdzony && (
                        <>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleActiveUser(n.id)}
                          >
                            ✅ Aktywuj
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleSendTokenToUser(n.id)}
                          >
                            📩 Wyślij token
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* DODAWANIE */}
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
              <option value={0}>Brak wychowawstwa</option>
              {klasy.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nazwa}
                </option>
              ))}
            </select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Klasy prowadzone</label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {klasy.map((k) => (
                  <label key={k.id} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.klasyIds.includes(k.id)}
                      onChange={() => toggleSelect(k.id, "klasyIds")}
                      className="rounded"
                    />
                    <span>{k.nazwa}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Wybrano: {formData.klasyIds.length} {formData.klasyIds.length === 1 ? "klasę" : "klas"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Przedmioty prowadzone</label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {przedmioty.map((p) => (
                  <label key={p.id} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.przedmiotyIds.includes(p.id)}
                      onChange={() => toggleSelect(p.id, "przedmiotyIds")}
                      className="rounded"
                    />
                    <span>{p.nazwa}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Wybrano: {formData.przedmiotyIds.length} {formData.przedmiotyIds.length === 1 ? "przedmiot" : "przedmioty"}
              </p>
            </div>

            <p className="text-sm text-gray-500">* - pola wymagane</p>
          </div>
          <div className="mt-6 flex gap-2">
            <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              💾 Zapisz
            </button>
            <button
              onClick={() => {
                setViewMode("list");
                resetForm();
              }}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              🔙 Anuluj
            </button>
          </div>
        </div>
      )}

      {/* EDYCJA */}
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
                <option key={k.id} value={k.id}>
                  {k.nazwa}
                </option>
              ))}
            </select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Klasy prowadzone</label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {klasy.map((k) => (
                  <label key={k.id} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.klasyIds.includes(k.id)}
                      onChange={() => toggleSelect(k.id, "klasyIds")}
                      className="rounded"
                    />
                    <span>{k.nazwa}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Wybrano: {formData.klasyIds.length} {formData.klasyIds.length === 1 ? "klasę" : "klas"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Przedmioty prowadzone</label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {przedmioty.map((p) => (
                  <label key={p.id} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.przedmiotyIds.includes(p.id)}
                      onChange={() => toggleSelect(p.id, "przedmiotyIds")}
                      className="rounded"
                    />
                    <span>{p.nazwa}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Wybrano: {formData.przedmiotyIds.length} {formData.przedmiotyIds.length === 1 ? "przedmiot" : "przedmioty"}
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button onClick={handleEdit} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              💾 Zapisz zmiany
            </button>
            <button
              onClick={() => {
                setViewMode("list");
                resetForm();
              }}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              🔙 Anuluj
            </button>
          </div>
        </div>
      )}

      {/* SZCZEGÓŁY */}
      {viewMode === "details" && selectedNauczyciel && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Szczegóły nauczyciela</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedNauczyciel.id}</p>
            <p><strong>Imię:</strong> {selectedNauczyciel.imie}</p>
            <p><strong>Nazwisko:</strong> {selectedNauczyciel.nazwisko}</p>
            <p><strong>Email:</strong> {selectedNauczyciel.email}</p>
            <p><strong>Email potwierdzony:</strong> {selectedNauczyciel.czyEmailPotwierdzony ? "Tak ✓" : "Nie ✗"}</p>
            <p><strong>Wychowawstwo:</strong> {selectedNauczyciel.czyWychowawca ? selectedNauczyciel.wychowawstwoKlasaNazwa : "Nie"}</p>
            {selectedNauczyciel.klasy && selectedNauczyciel.klasy.length > 0 && (
              <div>
                <strong>Klasy:</strong>
                <ul className="list-disc ml-6 mt-2">
                  {selectedNauczyciel.klasy.map((k) => (
                    <li key={k.id}>{k.nazwa}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedNauczyciel.przedmioty && selectedNauczyciel.przedmioty.length > 0 && (
              <div>
                <strong>Przedmioty:</strong>
                <ul className="list-disc ml-6 mt-2">
                  {selectedNauczyciel.przedmioty.map((p) => (
                    <li key={p.id}>{p.nazwa}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button onClick={() => setViewMode("list")} className="mt-4 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">
            🔙 Wróć
          </button>
        </div>
      )}
    </div>
  );
}
