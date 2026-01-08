// src/api/PanelUczniaService.ts
import { fetchAPI } from "./api";

const BASE = "/PanelUcznia";

export interface OcenaUczenDto {
  id: number;
  przedmiotNazwa: string;
  wartosc: number;
  typOceny: string;
  opis: string;
  dataWystawienia: string;
  nauczyciel: string;
}

export interface OcenyPoPrzedmiotachDto {
  przedmiotNazwa: string;
  oceny: OcenaUczenDto[];
  sredniaArytmetyczna: number;
}

export interface OcenyUczniaResponseDto {
  ocenyPoPrzedmiotach: OcenyPoPrzedmiotachDto[];
  sredniaOgolna: number;
}

export interface ZajeciaUczniaDto {
  id: number;
  przedmiotNazwa: string;
  godzinaRozpoczecia: string;
  godzinaZakonczenia: string;
    dzienTygodnia: number;
  nauczycielImieNazwisko: string;
  salaNumer: string;
}

export interface PlanLekcjiResponseDto {
  zajecia: ZajeciaUczniaDto[];
  klasaNazwa: string;
}

export interface FrekwencjaUczniaDto {
  id: number;
  przedmiotNazwa: string;
  data: string;
  status: string;
  godzinaRozpoczecia: string;
  godzinaZakonczenia: string;
}

export interface StatystykiFrekwencjiDto {
  liczbaOgolem: number;
  liczbaObecnosci: number;
  liczbaNieobecnosci: number;
  liczbaSpoznien: number;
  liczbaUsprawiedliwionych: number;
  procentObecnosci: number;
}

export interface FrekwencjaUczniaResponseDto {
  frekwencje: FrekwencjaUczniaDto[];
  statystyki: StatystykiFrekwencjiDto;
}

export interface PodsumowaniePaneluUczniaDto {
  imieNazwisko: string;
  klasaNazwa: string;
  sredniaOcen: number;
  ostatnieOceny: OcenaUczenDto[];
  planLekcji: ZajeciaUczniaDto[];
  procentObecnosci: number;
}

// ========== OCENY ==========
export function pobierzOcenyUcznia(uczenId: number) {
  return fetchAPI(`${BASE}/oceny/${uczenId}`, {
    method: "GET",
  }) as Promise<OcenyUczniaResponseDto>;
}

// ========== PLAN LEKCJI ==========
export function pobierzPlanLekcjiUcznia(uczenId: number) {
  return fetchAPI(`${BASE}/plan-lekcji/${uczenId}`, {
    method: "GET",
  }) as Promise<PlanLekcjiResponseDto>;
}

// ========== FREKWENCJA ==========
export function pobierzFrekwencjeUcznia(
  uczenId: number, 
  dataOd?: string, 
  dataDo?: string
) {
  const params = new URLSearchParams();
  if (dataOd) params.append("dataOd", dataOd);
  if (dataDo) params.append("dataDo", dataDo);
  
  return fetchAPI(`${BASE}/frekwencja/${uczenId}${params.toString() ? `?${params.toString()}` : ''}`, {
    method: "GET",
  }) as Promise<FrekwencjaUczniaResponseDto>;
}

// ========== PODSUMOWANIE ==========
export function pobierzPodsumowanieUcznia(uczenId: number) {
  return fetchAPI(`${BASE}/podsumowanie/${uczenId}`, {
    method: "GET",
  }) as Promise<PodsumowaniePaneluUczniaDto>;
}
