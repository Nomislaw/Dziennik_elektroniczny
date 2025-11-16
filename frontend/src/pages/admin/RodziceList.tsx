import { useEffect, useState } from "react";
import { pobierzRodzicow, usunUzytkownika, dodajRodzica, edytujRodzica, pobierzUczniow } from "../../api/UżytkownikService";

type Rodzic = {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  czyEmailPotwierdzony: boolean;
  dzieci?: { id: number; imie: string; nazwisko: string; klasaNazwa?: string }[];
};

type ViewMode = "list" | "add" | "edit" | "details";

export default function RodziceList() {
  const [rodzice, setRodzice] = useState<Rodzic[]>([]);
  const [uczniowie, setUczniowie] = useState<{ id: number; imie: string; nazwisko: string; klasaNazwa?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedRodzic, setSelectedRodzic] = useState<Rodzic | null>(null);
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
    dzieciIds: [] as number[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    setLoading(true); // ✅ Ustaw loading na początku
    const [rodziceData, uczniowieData] = await Promise.all([
      pobierzRodzicow(),
      pobierzUczniow(),
    ]);
    setRodzice(rodziceData);
    setUczniowie(uczniowieData);
  } catch (err) {
    console.error("Błąd ładowania danych:", err);
    alert("Błąd podczas ładowania danych"); // ✅ Poinformuj użytkownika
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego rodzica?")) return;
    try {
      await usunUzytkownika(id.toString());
      setRodzice((prev) => prev.filter((r) => r.id !== id));
      alert("Rodzic został usunięty.");
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć rodzica.");
    }
  };

  const handleAdd = async () => {
    if (!formData.imie || !formData.nazwisko || !formData.email || !formData.haslo || formData.dzieciIds.length === 0) {
      alert("Wypełnij wszystkie pola i wybierz co najmniej jedno dziecko!");
      return;
    }

    try {
      await dodajRodzica(formData);
      alert("Rodzic został dodany.");
      loadData();
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Nie udało się dodać rodzica.");
    }
  };

  const handleEdit = async () => {
    if (!selectedRodzic) return;

    if (formData.dzieciIds.length === 0) {
      alert("Rodzic musi mieć przypisane co najmniej jedno dziecko!");
      return;
    }

    try {
      await edytujRodzica(selectedRodzic.id.toString(), {
        imie: formData.imie,
        nazwisko: formData.nazwisko,
        email: formData.email,
        dzieciIds: formData.dzieciIds,
      });
      alert("Rodzic został zaktualizowany.");
      loadData();
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Nie udało się edytować rodzica.");
    }
  };

  const openEditMode = (rodzic: Rodzic) => {
    setSelectedRodzic(rodzic);
    setFormData({
      imie: rodzic.imie,
      nazwisko: rodzic.nazwisko,
      email: rodzic.email,
      haslo: "",
      dzieciIds: rodzic.dzieci?.map((d) => d.id) || [],
    });
    setViewMode("edit");
  };

  const toggleDziecko = (dzieckoId: number) => {
    setFormData((prev) => ({
      ...prev,
      dzieciIds: prev.dzieciIds.includes(dzieckoId)
        ? prev.dzieciIds.filter((id) => id !== dzieckoId)
        : [...prev.dzieciIds, dzieckoId],
    }));
  };

  const resetForm = () => {
    setFormData({ imie: "", nazwisko: "", email: "", haslo: "", dzieciIds: [] });
    setSelectedRodzic(null);
  };

  if (loading) return <p>Ładowanie danych...</p>;

  return (
    <div>
      {viewMode === "list" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lista rodziców ({rodzice.length})</h2>
            <button
              onClick={() => setViewMode("add")}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              ➕ Dodaj rodzica
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imię i nazwisko</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dzieci</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rodzice.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{r.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{r.imie} {r.nazwisko}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.email}</td>
                    <td className="px-6 py-4 text-sm">
                      {r.dzieci && r.dzieci.length > 0 ? (
                        <div className="space-y-1">
                          {r.dzieci.map((d) => (
                            <div key={d.id} className="text-xs">
                              👶 {d.imie} {d.nazwisko} {d.klasaNazwa && `(${d.klasaNazwa})`}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {r.czyEmailPotwierdzony ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✓ Potwierdzony</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">⏳ Niepotwierdzony</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => { setSelectedRodzic(r); setViewMode("details"); }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        👁 Zobacz
                      </button>
                      <button
                        onClick={() => openEditMode(r)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        ✏️ Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑 Usuń
                      </button>
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
          <h2 className="text-2xl font-bold mb-4">Dodaj nowego rodzica</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wybierz dzieci * (co najmniej jedno)
              </label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {uczniowie.map((u) => (
                  <label key={u.id} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dzieciIds.includes(u.id)}
                      onChange={() => toggleDziecko(u.id)}
                      className="rounded"
                    />
                    <span>
                      {u.imie} {u.nazwisko} {u.klasaNazwa && `(${u.klasaNazwa})`}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Wybrano: {formData.dzieciIds.length} {formData.dzieciIds.length === 1 ? "dziecko" : "dzieci"}
              </p>
            </div>
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

      {viewMode === "edit" && selectedRodzic && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Edytuj rodzica</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wybierz dzieci (co najmniej jedno)
              </label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {uczniowie.map((u) => (
                  <label key={u.id} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dzieciIds.includes(u.id)}
                      onChange={() => toggleDziecko(u.id)}
                      className="rounded"
                    />
                    <span>
                      {u.imie} {u.nazwisko} {u.klasaNazwa && `(${u.klasaNazwa})`}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Wybrano: {formData.dzieciIds.length} {formData.dzieciIds.length === 1 ? "dziecko" : "dzieci"}
              </p>
            </div>
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

      {viewMode === "details" && selectedRodzic && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Szczegóły rodzica</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedRodzic.id}</p>
            <p><strong>Imię:</strong> {selectedRodzic.imie}</p>
            <p><strong>Nazwisko:</strong> {selectedRodzic.nazwisko}</p>
            <p><strong>Email:</strong> {selectedRodzic.email}</p>
            <p><strong>Email potwierdzony:</strong> {selectedRodzic.czyEmailPotwierdzony ? "Tak ✓" : "Nie ✗"}</p>
            {selectedRodzic.dzieci && selectedRodzic.dzieci.length > 0 && (
              <div>
                <strong>Dzieci:</strong>
                <ul className="list-disc ml-6 mt-2">
                  {selectedRodzic.dzieci.map((d) => (
                    <li key={d.id}>
                      {d.imie} {d.nazwisko} {d.klasaNazwa && `(klasa ${d.klasaNazwa})`}
                    </li>
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