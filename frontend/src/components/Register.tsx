import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Rejestracja:", form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          🧾 Rejestracja do Dziennika
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Imię i nazwisko"
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Adres e-mail"
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Hasło"
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
          >
            Zarejestruj się
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Masz już konto?{" "}
          <a href="/login" className="text-green-600 font-medium hover:underline">
            Zaloguj się
          </a>
        </p>
      </div>
    </div>
  );
}
