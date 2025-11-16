import { fetchAPI } from "./api";

const BASE = "/uzytkownik";

export function pobierzUzytkownikow() {
  return fetchAPI(`${BASE}`, {
    method: "GET",
  });
}

export function dodajUzytkownika(dane: {
  imie: string;
  nazwisko: string;
  email: string;
  haslo: string;
}) {
  return fetchAPI(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}


export function usunUzytkownika(id: string) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export function resetujHaslo(email: string) {
  return fetchAPI(`${BASE}/reset-hasla`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}


export function wyslijPonownyToken(email: string) {
  return fetchAPI(`${BASE}/link-aktywacyjny`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function edytujUzytkownika(id: string, dane: {
  imie: string;
  nazwisko: string;
  email: string;
  rola: "Uczen" | "Nauczyciel" | "Rodzic" | "Administrator";
}) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ user: dane }), // <-- opakowanie w "user"
  });
}


