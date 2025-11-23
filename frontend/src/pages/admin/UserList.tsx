import { useEffect, useState } from "react";
import { pobierzUczniow, pobierzNauczycieli, pobierzRodzicow, pobierzAdministratorow, usunUzytkownika } from "../../api/UzytkownikService";
import { Uzytkownik } from "../../types/Uzytkownik";

type ViewMode = "list" | "details";

export default function UsersList() {
  const [users, setUsers] = useState<Uzytkownik[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Uzytkownik | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterRola, setFilterRola] = useState<string>("all");

  // Pobieranie użytkowników
  useEffect(() => {
    loadUsers();
  }, [filterRola]);

  const loadUsers = async () => {
    try {
      let dane: any[] = [];
      
      if (filterRola === "all") {
        // Pobierz wszystkich
        const [uczniowie, nauczyciele, rodzice, admini] = await Promise.all([
          pobierzUczniow(),
          pobierzNauczycieli(),
          pobierzRodzicow(),
          pobierzAdministratorow(),
        ]);
        dane = [...uczniowie, ...nauczyciele, ...rodzice, ...admini];
      } else if (filterRola === "Uczen") {
        dane = await pobierzUczniow();
      } else if (filterRola === "Nauczyciel") {
        dane = await pobierzNauczycieli();
      } else if (filterRola === "Rodzic") {
        dane = await pobierzRodzicow();
      } else if (filterRola === "Administrator") {
        dane = await pobierzAdministratorow();
      }
      
      setUsers(dane);
    } catch (err) {
      console.error("Błąd pobierania użytkowników:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (user: Uzytkownik) => {
    setSelectedUser(user);
    setViewMode("details");
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

  if (loading) return <p>Ładowanie danych...</p>;

  return (
    <div className="p-6">
      {viewMode === "list" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Lista użytkowników</h1>
            
            {/* Filtr według roli */}
            <select
              value={filterRola}
              onChange={(e) => setFilterRola(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">Wszyscy</option>
              <option value="Uczen">Uczniowie</option>
              <option value="Nauczyciel">Nauczyciele</option>
              <option value="Rodzic">Rodzice</option>
              <option value="Administrator">Administratorzy</option>
            </select>
          </div>

          <table className="w-full border-collapse border border-gray-300 bg-white">
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
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      u.rola === "Uczen" ? "bg-blue-100 text-blue-800" :
                      u.rola === "Nauczyciel" ? "bg-green-100 text-green-800" :
                      u.rola === "Rodzic" ? "bg-purple-100 text-purple-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {u.rola}
                    </span>
                  </td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => handleView(u)} className="bg-blue-500 text-white px-2 py-1 rounded">
                      👁 Zobacz
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                      🗑 Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {viewMode === "details" && selectedUser && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Szczegóły użytkownika</h2>
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Imię:</strong> {selectedUser.imie}</p>
          <p><strong>Nazwisko:</strong> {selectedUser.nazwisko}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Rola:</strong> {selectedUser.rola}</p>
          <button onClick={() => setViewMode("list")} className="mt-4 bg-gray-300 px-3 py-1 rounded">
            🔙 Wróć
          </button>
        </div>
      )}
    </div>
  );
}