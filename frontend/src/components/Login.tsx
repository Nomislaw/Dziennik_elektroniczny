"use client";

import { useState } from "react";
import { login } from "../api/AuthService"; // import funkcji login z api.ts
import { Uzytkownik } from "../types/Uzytkownik";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const router = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user: Uzytkownik = await login(form.email, form.password);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);
      console.log("Zalogowano użytkownika:", user);
  
      if (user.rola === "Administrator") {
          router("/admin");
          } else if (user.rola === "Nauczyciel") {
            router("/teacher");
          }
           else {
          router("/dashboard");
          }
    } catch (err: any) {
      setError(err.message || "Błąd logowania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🔑 Logowanie do Dziennika
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          <input
            type="email"
            name="email"
            placeholder="Adres e-mail"
            value={form.email}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            value={form.password}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Nie masz konta?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Zarejestruj się
          </a>
        </p>
      </div>
    </div>
  );
}