import { useEffect, useState } from "react";
import { pobierzUczniow, usunUzytkownika, dodajUcznia, edytujUcznia, pobierzKlasy, zmienRoleUzytkownika,aktywujUzytkownika,
  wyslijTokenUzytkownika } from "../../api/UzytkownikService";

type Uczen = {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  klasaId?: number;
  klasaNazwa?: string;
  czyEmailPotwierdzony: boolean;
   rola: "Administrator" | "Nauczyciel" | "Rodzic" | "Uczen";
  rodzice?: { id: number; imie: string; nazwisko: string }[];
};

type ViewMode = "list" | "add" | "edit" | "details";

export default function UczniowieList() {
  const [uczniowie, setUczniowie] = useState<Uczen[]>([]);
  const [klasy, setKlasy] = useState<{ id: number; nazwa: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedUczen, setSelectedUczen] = useState<Uczen | null>(null);
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
    klasaId: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [uczniowieData, klasyData] = await Promise.all([
        pobierzUczniow(),
        pobierzKlasy(),
      ]);
      setUczniowie(uczniowieData);
      setKlasy(klasyData);
    } catch (err) {
      console.error("Błąd ładowania danych:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego ucznia?")) return;
    try {
      await usunUzytkownika(id.toString());
      setUczniowie((prev) => prev.filter((u) => u.id !== id));
      alert("Uczeń został usunięty.");
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć ucznia.");
    }
  };

  const handleAdd = async () => {
    if (!formData.imie || !formData.nazwisko || !formData.email || !formData.haslo || !formData.klasaId) {
      alert("Wypełnij wszystkie pola!");
      return;
    }

    try {
      await dodajUcznia(formData);
      alert("Uczeń został dodany.");
      loadData();
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Nie udało się dodać ucznia.");
    }
  };

   const handleRoleChange = async (id: number, nowaRola: string) => {
        try {
          await zmienRoleUzytkownika(id.toString(), nowaRola);
          setUczniowie((prev) =>
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
    const user = uczniowie.find((u) => u.id === id);
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

  const handleSendTokenToUser = async (id: number) => {
    const user = uczniowie.find((u) => u.id === id);
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

  const handleEdit = async () => {
    if (!selectedUczen) return;

    try {
      await edytujUcznia(selectedUczen.id.toString(), {
        imie: formData.imie,
        nazwisko: formData.nazwisko,
        email: formData.email,
        klasaId: formData.klasaId,
      });
      alert("Uczeń został zaktualizowany.");
      loadData();
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Nie udało się edytować ucznia.");
    }
  };

  const openEditMode = (uczen: Uczen) => {
    setSelectedUczen(uczen);
    setFormData({
      imie: uczen.imie,
      nazwisko: uczen.nazwisko,
      email: uczen.email,
      haslo: "",
      klasaId: uczen.klasaId || 0,
    });
    setViewMode("edit");
  };

  const resetForm = () => {
    setFormData({ imie: "", nazwisko: "", email: "", haslo: "", klasaId: 0 });
    setSelectedUczen(null);
  };

  if (loading) return <p>Ładowanie danych...</p>;

  return (
    <div>
      {viewMode === "list" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lista uczniów ({uczniowie.length})</h2>
            <button
              onClick={() => setViewMode("add")}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              ➕ Dodaj ucznia
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klasa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uczniowie.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{u.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{u.imie} {u.nazwisko}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={u.rola}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="border rounded-lg px-2 py-1"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Nauczyciel">Nauczyciel</option>
                        <option value="Rodzic">Rodzic</option>
                        <option value="Uczen">Uczeń</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{u.klasaNazwa || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.czyEmailPotwierdzony ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✓ Potwierdzony</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">⏳ Niepotwierdzony</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => { setSelectedUczen(u); setViewMode("details"); }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        👁 Zobacz
                      </button>
                      <button
                        onClick={() => openEditMode(u)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        ✏️ Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑 Usuń
                      </button>

                       {u.czyEmailPotwierdzony === false && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleActiveUser(u.id)}
                          >
                            ✅ Aktywuj
                          </button>
                        )}

                        {u.czyEmailPotwierdzony === false && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleSendTokenToUser(u.id)}
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
          <h2 className="text-2xl font-bold mb-4">Dodaj nowego ucznia</h2>
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
            <input
              type="password"
              placeholder="Hasło"
              value={formData.haslo}
              onChange={(e) => setFormData({ ...formData, haslo: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <select
              value={formData.klasaId}
              onChange={(e) => setFormData({ ...formData, klasaId: Number(e.target.value) })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value={0}>Wybierz klasę</option>
              {klasy.map((k) => (
                <option key={k.id} value={k.id}>{k.nazwa}</option>
              ))}
            </select>
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

      {viewMode === "edit" && selectedUczen && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Edytuj ucznia</h2>
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
              value={formData.klasaId}
              onChange={(e) => setFormData({ ...formData, klasaId: Number(e.target.value) })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value={0}>Wybierz klasę</option>
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

      {viewMode === "details" && selectedUczen && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Szczegóły ucznia</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedUczen.id}</p>
            <p><strong>Imię:</strong> {selectedUczen.imie}</p>
            <p><strong>Nazwisko:</strong> {selectedUczen.nazwisko}</p>
            <p><strong>Email:</strong> {selectedUczen.email}</p>
            <p><strong>Klasa:</strong> {selectedUczen.klasaNazwa || "—"}</p>
            <p><strong>Email potwierdzony:</strong> {selectedUczen.czyEmailPotwierdzony ? "Tak ✓" : "Nie ✗"}</p>
            {selectedUczen.rodzice && selectedUczen.rodzice.length > 0 && (
              <div>
                <strong>Rodzice:</strong>
                <ul className="list-disc ml-6">
                  {selectedUczen.rodzice.map((r) => (
                    <li key={r.id}>{r.imie} {r.nazwisko}</li>
                  ))}
                </ul>
              </div>
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