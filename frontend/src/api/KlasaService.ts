import { fetchAPI } from "./api";

const BASE = "/klasa";

export function pobierzKlasa() {
  return fetchAPI(`${BASE}`, { method: "GET" });
}

export function dodajKlasa(data: { nazwa: string; rok: number; wychowawcaId: number | null; planId: number | null }) {
  return fetchAPI(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export function usunKlasa(id: number) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export function edytujKlasa(id: number, data: { nazwa: string, rok: number }) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

