import { fetchAPI } from "./api";

const BASE = "/uzytkownik";

// Pobieranie według ról
export function zmienRoleUzytkownika(id: string, nowaRola: string) {
  const url = `${BASE}/${id}/rola?nowaRola=${encodeURIComponent(nowaRola)}`;
  return fetchAPI(url, { method: "POST" });
}

export function pobierzUczniow() {
  return fetchAPI(`${BASE}/uczniowie`, { method: "GET" });
}

export function pobierzNauczycieli() {
  return fetchAPI(`${BASE}/nauczyciele`, { method: "GET" });
}

export function pobierzRodzicow() {
  return fetchAPI(`${BASE}/rodzice`, { method: "GET" });
}

export function pobierzAdministratorow() {
  return fetchAPI(`${BASE}/administratorzy`, { method: "GET" });
}

// Pobieranie szczegółów po ID według roli
export function pobierzUczniaById(id: string) {
  return fetchAPI(`${BASE}/uczen/${id}`, { method: "GET" });
}

export function pobierzNauczycielaById(id: string) {
  return fetchAPI(`${BASE}/nauczyciel/${id}`, { method: "GET" });
}

export function pobierzRodzicaById(id: string) {
  return fetchAPI(`${BASE}/rodzic/${id}`, { method: "GET" });
}

export function pobierzAdministratoraById(id: string) {
  return fetchAPI(`${BASE}/administrator/${id}`, { method: "GET" });
}

// Dodawanie według ról
export function dodajUcznia(dane: {
  imie: string;
  nazwisko: string;
  email: string;
  haslo: string;
  klasaId: number;
  rodziceIds?: number[];
}) {
  return fetchAPI(`${BASE}/uczen`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}

export function dodajNauczyciela(dane: {
  imie: string;
  nazwisko: string;
  email: string;
  haslo: string;
  wychowawstwoKlasaId?: number;
}) {
  return fetchAPI(`${BASE}/nauczyciel`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}

export function dodajRodzica(dane: {
  imie: string;
  nazwisko: string;
  email: string;
  haslo: string;
  dzieciIds: number[];
}) {
  return fetchAPI(`${BASE}/rodzic`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}

export function dodajAdministratora(dane: {
  imie: string;
  nazwisko: string;
  email: string;
  haslo: string;
}) {
  return fetchAPI(`${BASE}/administrator`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}

// Edycja według ról
export function edytujUcznia(id: string, dane: {
  imie: string;
  nazwisko: string;
  email: string;
  klasaId: number;
  rodziceIds?: number[];
}) {
  return fetchAPI(`${BASE}/uczen/${id}`, {
    method: "PUT",
    body: JSON.stringify(dane),
  });
}

export function edytujNauczyciela(id: string, dane: {
  imie: string;
  nazwisko: string;
  email: string;
  wychowawstwoKlasaId?: number;
}) {
  return fetchAPI(`${BASE}/nauczyciel/${id}`, {
    method: "PUT",
    body: JSON.stringify(dane),
  });
}

export function edytujRodzica(id: string, dane: {
  imie: string;
  nazwisko: string;
  email: string;
  dzieciIds: number[];
}) {
  return fetchAPI(`${BASE}/rodzic/${id}`, {
    method: "PUT",
    body: JSON.stringify(dane),
  });
}

export function edytujAdministratora(id: string, dane: {
  imie: string;
  nazwisko: string;
  email: string;
}) {
  return fetchAPI(`${BASE}/administrator/${id}`, {
    method: "PUT",
    body: JSON.stringify(dane),
  });
}

// Usuwanie
export function usunUzytkownika(id: string) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export function aktywujUzytkownika(id: number) {
  return fetchAPI(`${BASE}/${id}/aktywuj-profil`, {
    method: "PUT",
  });
}

export function wyslijTokenUzytkownika(id: number) {
  return fetchAPI(`${BASE}/${id}/link-aktywacyjny`, {
    method: "POST",
  });
}

// Pobieranie klas (dla select w formularzach)
export function pobierzKlasy() {
  return fetchAPI("/klasa", { method: "GET" });
}
