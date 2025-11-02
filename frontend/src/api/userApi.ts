// src/api/userApi.ts
const API_URL = "http://localhost:7292/api/uzytkownik/"; // dopasuj port backendu

// 🧱 Pomocnicza funkcja do PATCH
async function patch(url: string, params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/${url}?${query}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // jeśli używacie cookie z JWT
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.text();
}

export async function zmienHaslo(stareHaslo: string, noweHaslo: string) {
  return patch("password", { stareHaslo, noweHaslo });
}

export async function zmienDane(imie: string, nazwisko: string) {
  return patch("data", { imie, nazwisko });
}

export async function zmienEmail(nowyEmail: string) {
  return patch("email", { nowyEmail });
}
