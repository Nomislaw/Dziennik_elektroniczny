import { useEffect, useState } from "react";
import {
  pobierzPrzedmioty,
  dodajPrzedmiot,
  edytujPrzedmiot,
  usunPrzedmiot,
} from "../../api/PrzedmiotService";

interface Przedmiot {
  id: number;
  nazwa: string;
}

export default function PrzedmiotList() {
  const [przedmioty, setPrzedmioty] = useState<Przedmiot[]>([]);
  const [nazwa, setNazwa] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const data = await pobierzPrzedmioty();
    setPrzedmioty(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć przedmiot?")) return;

    await usunPrzedmiot(id);
    load();
  };

  const handleEdit = (p: Przedmiot) => {
    setEditId(p.id);
    setNazwa(p.nazwa);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!nazwa.trim()) {
      alert("Wpisz nazwę przedmiotu!");
      return;
    }

    if (editId === null) {
      await dodajPrzedmiot({ nazwa });
    } else {
      await edytujPrzedmiot(editId, { nazwa });
    }

    setNazwa("");
    setEditId(null);
    setShowForm(false);
    load();
  };

  return (
    <div className="max-w-2xl mx-auto">

      {/* Guzik Dodawania */}
      <button
        onClick={() => {
          setShowForm(true);
          setEditId(null);
          setNazwa("");
        }}
        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition mb-4"
      >
        ➕ Dodaj przedmiot
      </button>

      {/* Formularz dodawania / edycji */}
      {showForm && (
        <div className="bg-white shadow-md rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">
            {editId ? "✏️ Edytuj przedmiot" : "📘 Dodaj nowy przedmiot"}
          </h3>

          <input
            type="text"
            placeholder="Nazwa przedmiotu"
            value={nazwa}
            onChange={(e) => setNazwa(e.target.value)}
            className="w-full border p-2 rounded-lg mb-3"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              💾 Zapisz
            </button>

            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setNazwa("");
              }}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              ❌ Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Lista przedmiotów */}
      <div className="space-y-3">
        {przedmioty.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-sm border rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium">{p.nazwa}</p>
              <p className="text-gray-400 text-sm">ID: {p.id}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(p)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                ✏️ Edytuj
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                🗑 Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
