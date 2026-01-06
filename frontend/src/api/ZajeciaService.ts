// src/api/ZajeciaService.ts
import { fetchAPI } from "./api";

const BASE = "/Zajecia"; // => /api/Zajecia

// dopasowane do ZajeciaDto z kontrolera, w camelCase
export interface ZajeciaDto {
  id: number;
  godzinaRozpoczecia: string;
  godzinaZakonczenia: string;
  dzienTygodnia: number; // enum DayOfWeek jako int
  planId: number | null;
  planNazwa: string | null;
  klasaId: number | null;
  przedmiotId: number | null;
  przedmiotNazwa: string | null;
  nauczycielId: number | null;
  nauczycielImieNazwisko: string | null;
  salaId: number | null;
  salaNazwa: string | null;
}

// dopasowane do ZajeciaCreateDto
export interface ZajeciaCreateDto {
  godzinaRozpoczecia: string;
  godzinaZakonczenia: string;
  dzienTygodnia: number;
  planId: number;
  przedmiotId: number;
  nauczycielId: number;
  salaId: number;
}

// dopasowane do ZajeciaUpdateDto
export interface ZajeciaUpdateDto {
  godzinaRozpoczecia?: string;
  godzinaZakonczenia?: string;
  dzienTygodnia?: number;
  planId?: number;
  przedmiotId?: number;
  nauczycielId?: number;
  salaId?: number;
}

export function pobierzZajecia(): Promise<ZajeciaDto[]> {
  return fetchAPI(`${BASE}`, {
    method: "GET",
  });
}

export function pobierzZajeciaById(id: number): Promise<ZajeciaDto> {
  return fetchAPI(`${BASE}/${id}`, {
    method: "GET",
  });
}

export function pobierzZajeciaNauczyciela(id: number): Promise<ZajeciaDto[]> {
  return fetchAPI(`${BASE}/nauczyciel/${id}`, {
    method: "GET",
  });
}

export function dodajZajecia(dane: ZajeciaCreateDto) {
  return fetchAPI(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(dane),
  });
}

export function edytujZajecia(id: number, dane: ZajeciaUpdateDto) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dane),
  });
}

export function usunZajecia(id: number) {
  return fetchAPI(`${BASE}/${id}`, {
    method: "DELETE",
  });
}
