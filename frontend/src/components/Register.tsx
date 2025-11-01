import { useState } from "react";
import { register } from "../api/AuthService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Hasła muszą być identyczne.");
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });

      alert("Rejestracja zakończona sukcesem!");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Błąd rejestracji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          🧾 Rejestracja do Dziennika
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <input
            name="firstName"
            placeholder="Imię"
            value={form.firstName}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="lastName"
            placeholder="Nazwisko"
            value={form.lastName}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Adres e-mail"
            value={form.email}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Hasło"
            value={form.password}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Potwierdź hasło"
            value={form.confirmPassword}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Rejestracja..." : "Zarejestruj się"}
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
