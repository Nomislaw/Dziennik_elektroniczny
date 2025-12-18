import { fetchAPI } from "./api";
import { OcenaCreateDto } from "../types/Ocena";

const BASE = "/Oceny"; // <-- dokładnie jak controller

export function pobierzOceny() {
  return fetchAPI(`${BASE}`, {
    method: "GET",
  });
}
export function pobierzOcenyUczenPrzedmiot(idUczen: number, idPrzedmiot: number) {
  return fetchAPI(`${BASE}/uczen/${idUczen}/przedmiot/${idPrzedmiot}`, {
    method: "GET",
  });
}

export function pobierzOcene(id: number) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "GET",
  });
}

export function addOcena(dane: OcenaCreateDto) {
  return fetchAPI(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}

export function edytujOcene(
  id: number,
  dane: {
    dataWystawienia?: string;
    opis?: string;
    wartosc?: number;
    typ?: number;
    uczenId?: number;
    nauczycielId?: number;
    przedmiotId?: number;
  }
) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dane),
  });
}

export function usunOcene(id: number) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "DELETE",
  });
}
