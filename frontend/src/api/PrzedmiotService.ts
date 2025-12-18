import { fetchAPI } from "./api";

const BASE = "/przedmiot"; // backend używa api/PrzedmiotController

export function pobierzPrzedmioty() {
  return fetchAPI(`${BASE}`, {
    method: "GET",
  });
}

export function pobierzPrzedmiotyNauczyciela(idNauczyciela: number) {
  return fetchAPI(`${BASE}/nauczyciel/${idNauczyciela}`, {
    method: "GET",
  });
}

export function dodajPrzedmiot(dane: { nazwa: string }) {
  return fetchAPI(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}

export function usunPrzedmiot(id: number) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export function edytujPrzedmiot(id: number, dane: { nazwa: string }) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      id,        // backend tego wymaga!
      nazwa: dane.nazwa
    }),
  });
}
