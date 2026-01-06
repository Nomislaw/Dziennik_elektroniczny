// src/api/FrekwencjaService.ts
import { fetchAPI } from "./api";

const BASE = "/frekwencja";

// ===== Typy zgodne z kontrolerem =====

// to, co zwraca GET: /api/Frekwencja i GET: /api/Frekwencja/{id}
export interface FrekwencjaDto {
  id: number;
  data: string; // DateTime z backendu jako string
  status: number; // dostosuj do swojego enumu, jeśli masz

  uczenId: number;
  uczenImieNazwisko: string;

  zajeciaId: number;
  przedmiotNazwa: string;
  nauczycielImieNazwisko: string;
  salaNazwa: string;
}

// to, co zwraca GET: /api/Frekwencja/filtrowana
export interface FrekwencjaDetailsDto {
  id: number;
  data: string;
  status: number;
  uczenId: number;
  zajeciaId: number;
}

// to, co przyjmuje POST
export interface FrekwencjaCreateDto {
  data: string;       // "2026-01-06T08:00:00"
  status: number;
  uczenId: number;
  zajeciaId: number;
}

// to, co przyjmuje PATCH
export interface FrekwencjaUpdateDto {
  data?: string;
  status?: number;
  uczenId?: number;
  zajeciaId?: number;
}

// to, co faktycznie zwraca POST (CreatedAtAction(..., f))
// czyli encja Frekwencja z backendu
export interface FrekwencjaEntity {
  id: number;
  data: string;
  status: number;
  uczenId: number;
  zajeciaId: number;
}

// ===== Funkcje serwisu =====

// GET: /api/Frekwencja
export function pobierzFrekwencje() {
  return fetchAPI(`${BASE}`, { method: "GET" });
}

// GET: /api/Frekwencja/{id}
export function pobierzFrekwencja(id: number) {
  return fetchAPI(`${BASE}/${id}`, { method: "GET" });
}

// GET: /api/Frekwencja/filtrowana?zajeciaId={id}&data={date}
export function pobierzFrekwencjeFiltrowane(zajeciaId: number, data: string) {
  const params = new URLSearchParams({
    zajeciaId: String(zajeciaId),
    data,
  }).toString();

  return fetchAPI(`${BASE}/filtrowana?${params}`, {
    method: "GET",
  });
}

// POST: /api/Frekwencja
export function dodajFrekwencja(data: FrekwencjaCreateDto) {
  return fetchAPI(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PATCH: /api/Frekwencja/{id}
export function edytujFrekwencja(id: number, data: FrekwencjaUpdateDto) {
  // kontroler zwraca tylko { message: "Zaktualizowano frekwencję." }
  return fetchAPI(`${BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// DELETE: /api/Frekwencja/{id}
export function usunFrekwencja(id: number) {
  // kontroler zwraca { message: "Usunięto frekwencję pomyślnie" } lub ErrorResponse
  return fetchAPI(`${BASE}/${id}`, {
    method: "DELETE",
  });
}
