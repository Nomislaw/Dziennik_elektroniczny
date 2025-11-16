import { useEffect, useState } from "react";
import { pobierzUzytkownikow, usunUzytkownika, edytujUzytkownika } from "../../api/UżytkownikService";
import { Uzytkownik } from "../../types/Uzytkownik";


type ViewMode = "list" | "details" | "edit";

export default function UsersList() {
  const [users, setUsers] = useState<Uzytkownik[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Uzytkownik | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editData, setEditData] = useState<Partial<Uzytkownik>>({});

  // Pobieranie użytkowników
  useEffect(() => {
    async function load() {
      try {
        const dane = await pobierzUzytkownikow();
        setUsers(dane);
      } catch (err) {
        console.error("Błąd pobierania użytkowników:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔹 Funkcje akcji
  const handleView = (user: Uzytkownik) => {
    setSelectedUser(user);
    setViewMode("details");
  };

  const handleEdit = (user: Uzytkownik) => {
    setSelectedUser(user);
    setEditData({ ...user });
    setViewMode("edit");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;
    try {
      await usunUzytkownika(id.toString());
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("Użytkownik został usunięty.");
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć użytkownika.");
    }
  };

  const handleSave = async () => {
  if (!selectedUser) return;

  try {
    await edytujUzytkownika(selectedUser.id.toString(), {
      imie: editData.imie || "",
      nazwisko: editData.nazwisko || "",
      email: editData.email || "",
      rola: editData.rola || "Uczen",
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, ...editData } as Uzytkownik : u
      )
    );

    alert("Użytkownik został zaktualizowany.");
    setViewMode("list");
  } catch (err) {
    console.error("Błąd podczas edycji użytkownika:", err);
    alert("Nie udało się edytować użytkownika.");
  }
};

  if (loading) return <p>Ładowanie danych...</p>;

  return (
    <div className="p-6">
      {viewMode === "list" && (
        <>
          <h1 className="text-2xl font-bold mb-4">Lista użytkowników</h1>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Imię</th>
                <th className="border p-2">Nazwisko</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Rola</th>
                <th className="border p-2">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="border p-2">{u.id}</td>
                  <td className="border p-2">{u.imie}</td>
                  <td className="border p-2">{u.nazwisko}</td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2">{u.rola}</td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => handleView(u)} className="bg-blue-500 text-white px-2 py-1 rounded">👁</button>
                    <button onClick={() => handleEdit(u)} className="bg-yellow-500 text-white px-2 py-1 rounded">✏️</button>
                    <button onClick={() => handleDelete(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {viewMode === "details" && selectedUser && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Szczegóły użytkownika</h2>
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Imię:</strong> {selectedUser.imie}</p>
          <p><strong>Nazwisko:</strong> {selectedUser.nazwisko}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Rola:</strong> {selectedUser.rola}</p>
          <button onClick={() => setViewMode("list")} className="mt-4 bg-gray-300 px-3 py-1 rounded">🔙 Wróć</button>
        </div>
      )}

      {viewMode === "edit" && selectedUser && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Edytuj użytkownika</h2>
          <div className="flex flex-col gap-2">
            <input value={editData.imie} onChange={(e) => setEditData({...editData, imie: e.target.value})} placeholder="Imię" className="border p-2 rounded"/>
            <input value={editData.nazwisko} onChange={(e) => setEditData({...editData, nazwisko: e.target.value})} placeholder="Nazwisko" className="border p-2 rounded"/>
            <input value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} placeholder="Email" className="border p-2 rounded"/>
            <select
  value={editData.rola}
  onChange={(e) => setEditData({ ...editData, rola: e.target.value as Uzytkownik["rola"] })}
  className="border p-2 rounded"
>
  <option value="Uczen">Uczeń</option>
  <option value="Nauczyciel">Nauczyciel</option>
  <option value="Rodzic">Rodzic</option>
  <option value="Administrator">Administrator</option>
</select>

          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">💾 Zapisz</button>
            <button onClick={() => setViewMode("list")} className="bg-gray-300 px-3 py-1 rounded">🔙 Wróć</button>
          </div>
        </div>
      )}
    </div>
  );
}
