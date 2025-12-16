import { useEffect, useState } from "react";
import {
  pobierzAdministratorow,
  usunUzytkownika,
  dodajAdministratora,
  edytujAdministratora,
  zmienRoleUzytkownika,
  aktywujUzytkownika,
  wyslijTokenUzytkownika,
  dezaktywujUzytkownika
} from "../../api/UzytkownikService";

type Administrator = {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  czyEmailPotwierdzony: boolean;
  rola: "Administrator" | "Nauczyciel" | "Rodzic" | "Uczen";
};

type ViewMode = "list" | "add" | "edit" | "details";

export default function AdministratorzyList() {
  const [administratorzy, setAdministratorzy] = useState<Administrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedAdministrator, setSelectedAdministrator] =
    useState<Administrator | null>(null);
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
    powtorzHaslo: "",
  });
  const [currentUser] = useState<Administrator | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await pobierzAdministratorow();
      setAdministratorzy(data);
    } catch (err) {
      console.error("Błąd ładowania administratorów:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego administratora?"))
      return;
    try {
      await usunUzytkownika(id.toString());
      setAdministratorzy((prev) => prev.filter((a) => a.id !== id));
      alert("Administrator został usunięty.");
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć administratora.");
    }
  };

  const handleAdd = async () => {
    if (!formData.imie || !formData.nazwisko || !formData.email || !formData.haslo || !formData.powtorzHaslo) {
      alert("Wypełnij wszystkie wymagane pola!");
      return;
    }

    if (formData.haslo !== formData.powtorzHaslo) {
  alert("Hasła nie są takie same!");
  return;
}

    try {
      const { imie, nazwisko, email, haslo } = formData;

await dodajAdministratora({
  imie,
  nazwisko,
  email,
  haslo,
});

      alert("Administrator został dodany.");
      loadData();
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err || "Nie udało się dodać administratora.");
    }
  };

  const handleEdit = async () => {
    if (!selectedAdministrator) return;

    try {
      await edytujAdministratora(selectedAdministrator.id.toString(), {
        imie: formData.imie,
        nazwisko: formData.nazwisko,
        email: formData.email,
      });
      alert("Administrator został zaktualizowany.");
      loadData();
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Nie udało się edytować administratora.");
    }
  };

const handleActiveUser = async (id: number) => {
    const user = administratorzy.find((u) => u.id === id);
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

  const handledeactiveUser = async (id: number) => {
    const user = administratorzy.find((u) => u.id === id);
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
    const user = administratorzy.find((u) => u.id === id);
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


  const openEditMode = (administrator: Administrator) => {
    setSelectedAdministrator(administrator);
    setFormData({
      imie: administrator.imie,
      nazwisko: administrator.nazwisko,
      email: administrator.email,
      haslo: "",
      powtorzHaslo: "",
    });
    setViewMode("edit");
  };

  const resetForm = () => {
    setFormData({ imie: "", nazwisko: "", email: "", haslo: "" , powtorzHaslo: ""});
    setSelectedAdministrator(null);
  };

  const handleRoleChange = async (id: number, nowaRola: string) => {
    try {
      await zmienRoleUzytkownika(id.toString(), nowaRola);
      setAdministratorzy((prev) =>
        prev.map((a) => (a.id === id ? { ...a, rola: nowaRola as any } : a))
      );
      alert("Rola została zmieniona.");
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Nie udało się zmienić roli.");
    }
  };

  if (loading) return <p>Ładowanie danych...</p>;

  return (
    <div>
      {/* LISTA */}
      {viewMode === "list" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Lista administratorów ({administratorzy.length})
            </h2>
            <button
              onClick={() => setViewMode("add")}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              ➕ Dodaj administratora
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Imię i nazwisko
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rola
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {administratorzy.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{a.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {a.imie} {a.nazwisko}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {a.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <select
                          value={a.rola}
                          onChange={(e) => handleRoleChange(a.id, e.target.value)}
                          disabled={a.id === currentUser?.id}
                          className={`border rounded-lg px-2 py-1
                            ${a.id === currentUser?.id ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          title={a.id === currentUser?.id ? "Nie możesz zmienić własnej roli" : ""}
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Nauczyciel">Nauczyciel</option>
                          <option value="Rodzic">Rodzic</option>
                          <option value="Uczen">Uczeń</option>
                        </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.czyEmailPotwierdzony ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          ✓ Potwierdzony
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          ⏳ Niepotwierdzony
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAdministrator(a);
                          setViewMode("details");
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        👁 Zobacz
                      </button>
                      <button
                        onClick={() => openEditMode(a)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        ✏️ Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑 Usuń
                      </button>
                      {a.czyEmailPotwierdzony === true && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handledeactiveUser(a.id)}
                          >
                            ❌ Dezaktywuj
                          </button>
                        )}

                        {a.czyEmailPotwierdzony === false && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleActiveUser(a.id)}
                          >
                            ✅ Aktywuj
                          </button>
                        )}

                        {a.czyEmailPotwierdzony === false && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleSendTokenToUser(a.id)}
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

      {/* DODAWANIE */}
      {viewMode === "add" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Dodaj nowego administratora</h2>
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
              value={formData.powtorzHaslo}
              onChange={(e) =>
                setFormData({ ...formData, powtorzHaslo: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
            />

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
      {viewMode === "edit" && selectedAdministrator && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Edytuj administratora</h2>
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
          </div>
          <div className="mt-6 flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
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
      {viewMode === "details" && selectedAdministrator && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Szczegóły administratora</h2>
          <div className="space-y-2">
            <p>
              <strong>ID:</strong> {selectedAdministrator.id}
            </p>
            <p>
              <strong>Imię:</strong> {selectedAdministrator.imie}
            </p>
            <p>
              <strong>Nazwisko:</strong> {selectedAdministrator.nazwisko}
            </p>
            <p>
              <strong>Email:</strong> {selectedAdministrator.email}
            </p>
            <p>
              <strong>Email potwierdzony:</strong>{" "}
              {selectedAdministrator.czyEmailPotwierdzony ? "Tak ✓" : "Nie ✗"}
            </p>
            <p>
              <strong>Rola:</strong> {selectedAdministrator.rola}
            </p>
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
