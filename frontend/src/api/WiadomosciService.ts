import { fetchAPI } from "./api";

const BASE = "/wiadomosci";

// ===== Typy =====

export interface WiadomoscDto {
  id: number;
  nadawcaId: number;
  odbiorcaId: number;
  tresc: string;
  dataWyslania: string;
  przeczytana: boolean;
}

export interface SendMessageDto {
  odbiorcaId: number;
  tresc: string;
}

// ===== REST =====

// GET: /api/wiadomosci/{userId}
export function pobierzRozmowe(userId: number) {
  return fetchAPI(`${BASE}/${userId}`, {
    method: "GET",
  });
}

// POST: /api/wiadomosci
export function wyslijWiadomosc(data: SendMessageDto) {
  return fetchAPI(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
