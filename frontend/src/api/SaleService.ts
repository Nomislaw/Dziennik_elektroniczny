import { fetchAPI } from "./api";

const BASE = "/sale";

export function pobierzSale() {
  return fetchAPI(`${BASE}`, { method: "GET" });
}

export function dodajSale(dane: { numer: string }) {
  return fetchAPI(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}

export function usunSale(id: number) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "DELETE",
  });
}
