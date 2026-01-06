// src/api/SemestrService.ts
import { fetchAPI } from "./api";

const BASE = "/semestr";

export interface Semestr {
  id: number;
  dataRozpoczecia: string; // ISO string z backendu
  dataZakonczenia: string;
  numer: number;
}

// 🔥 NOWE INTERFEJSY DLA DNI TYGODNIA
export interface DatyTygodniaResponse {
  daty: string[]; // ["2026-01-05", "2026-01-12", ...]
}

export interface DatyTygodniaZajecResponse {
  dzienTygodnia: number;
  daty: string[];
  nazwaDnia: string; // "Poniedziałek"
}

// ✅ EXISTING FUNKCJE (bez zmian)
export function pobierzSemestry() {
  return fetchAPI(`${BASE}`, { method: "GET" });
}

export function pobierzSemestr(id: number) {
  return fetchAPI(`${BASE}/${id}`, { method: "GET" });
}

export function dodajSemestr(data: Omit<Semestr, "id">) {
  return fetchAPI(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function edytujSemestr(id: number, data: Omit<Semestr, "id">) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function usunSemestr(id: number) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

// 🔥 NOWE FUNKCJE - dni tygodnia w semestrach
/**
 * Pobiera WSZYSTKIE daty konkretnego dnia tygodnia z aktywnych semestrów
 * @param dzienTygodnia 1=poniedziałek, 2=wtorek, ..., 5=piątek
 */
export function pobierzDatyDlaDniaTygodnia(dzienTygodnia: number): Promise<string[]> {
  return fetchAPI(`${BASE}/dni-tygodnia/${dzienTygodnia}`, { method: "GET" });
}



