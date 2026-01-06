import { fetchAPI } from "./api";

const BASE = "/Plan"; 

export function pobierzPlany() {
  return fetchAPI(`${BASE}/plany`, {
    method: "GET",
  });
}

export function pobierzPlan(id: number) {
  return fetchAPI(`${BASE}/plany/${id}`, {
    method: "GET",
  });
}

export function dodajPlan(dane: { klasaId: number; semestrId: number }) {
  return fetchAPI(`${BASE}/plan`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}

export function usunPlan(id: number) {
  return fetchAPI(`${BASE}/plany/${id}`, {
    method: "DELETE",
  });
}

export function edytujPlan(id: number, dane: { klasaId?: number; semestrId?: number }) {
  return fetchAPI(`${BASE}/plany/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dane),
  });
}

// Opcjonalnie: pełna aktualizacja PUT (jak w Przedmiot)
export function aktualizujPlan(id: number, dane: { id: number; klasaId: number; semestrId: number }) {
  return fetchAPI(`${BASE}/plany/${id}`, {
    method: "PUT",
    body: JSON.stringify(dane),
  });
}
