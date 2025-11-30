// src/pages/Settings.tsx
import { useState } from "react";
import { zmienHaslo, zmienDane, zmienEmail } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    stareHaslo: "",
    noweHaslo: "",
    potwierdzHaslo: "",
    imie: "",
    nazwisko: "",
    email: "",
    potwierdzEmail: ""
  });

  const [msg, setMsg] = useState("");

  const [activeSection, setActiveSection] =
    useState<"dane" | "email" | "haslo" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (type: "haslo" | "dane" | "email") => {
    try {
      setMsg("");

      if (type === "haslo") {
        if (form.noweHaslo !== form.potwierdzHaslo) {
          setMsg("❌ Hasła nie są identyczne!");
          return;
        }
        await zmienHaslo(form.stareHaslo, form.noweHaslo);
      }

      if (type === "dane") {
        await zmienDane(form.imie, form.nazwisko);
      }

      if (type === "email") {
        if (form.email !== form.potwierdzEmail) {
          setMsg("❌ Adresy e-mail nie są identyczne!");
          return;
        }
        await zmienEmail(form.email);
      }

      setMsg("✅ Zmiana zakończona sukcesem!");
    } catch (err: any) {
      console.error(err);

      let errorMsg = "Wystąpił błąd.";

      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.errors?.length > 0) {
        errorMsg = err.response.data.errors.join(", ");
      }

      setMsg("❌ " + errorMsg);
    }
  };

  return (
    <div className="p-0"> 

      <h1 className="text-2xl font-bold mb-4">⚙️ Ustawienia użytkownika</h1>

      {msg && (
        <div className="p-2 mb-4 rounded bg-white shadow text-center">{msg}</div>
      )}

      <div className="mb-4 space-x-2">
        <button
          onClick={() => setActiveSection("dane")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🧑 Zmień dane osobowe
        </button>
        <button
          onClick={() => setActiveSection("email")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          📧 Zmień e-mail
        </button>
        <button
          onClick={() => setActiveSection("haslo")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🔒 Zmień hasło
        </button>
      </div>

      {activeSection === "dane" && (
        <section className="bg-white p-4 rounded-2xl shadow mb-6">
          <h2 className="font-semibold mb-2">🧑 Dane osobowe</h2>
          <input
            name="imie"
            placeholder="Imię"
            value={form.imie}
            onChange={handleChange}
            className="p-2 border rounded mr-2"
          />
          <input
            name="nazwisko"
            placeholder="Nazwisko"
            value={form.nazwisko}
            onChange={handleChange}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={() => handleSubmit("dane")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Zapisz
          </button>
        </section>
      )}

      {activeSection === "email" && (
        <section className="bg-white p-4 rounded-2xl shadow mb-6">
          <h2 className="font-semibold mb-2">📧 Adres e-mail</h2>

          <input
            name="email"
            placeholder="Nowy e-mail"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded mr-2"
          />

          <input
            name="potwierdzEmail"
            placeholder="Potwierdź e-mail"
            value={form.potwierdzEmail}
            onChange={handleChange}
            className="p-2 border rounded mr-2"
          />

          <button
            onClick={() => handleSubmit("email")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Zapisz
          </button>
        </section>
      )}

      {activeSection === "haslo" && (
        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">🔒 Zmiana hasła</h2>

          <input
            type="password"
            name="stareHaslo"
            placeholder="Stare hasło"
            value={form.stareHaslo}
            onChange={handleChange}
            className="p-2 border rounded mr-2"
          />

          <input
            type="password"
            name="noweHaslo"
            placeholder="Nowe hasło"
            value={form.noweHaslo}
            onChange={handleChange}
            className="p-2 border rounded mr-2"
          />

          <input
            type="password"
            name="potwierdzHaslo"
            placeholder="Potwierdź nowe hasło"
            value={form.potwierdzHaslo}
            onChange={handleChange}
            className="p-2 border rounded mr-2"
          />

          <button
            onClick={() => handleSubmit("haslo")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Zapisz
          </button>
        </section>
      )}
    </div>
  );
}
