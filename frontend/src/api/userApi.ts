

import { fetchAPI } from "./api";

const API_URL = "/uzytkownik"; 


async function patch(endpoint: string, params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`${API_URL}/${endpoint}?${query}`, {
    method: "PATCH",
  });
}

export function zmienHaslo(stareHaslo: string, noweHaslo: string) {
  return patch("password", { stareHaslo, noweHaslo });
}

export function zmienDane(imie: string, nazwisko: string) {
  return patch("data", { imie, nazwisko });
}

export function zmienEmail(nowyEmail: string) {
  return patch("email", { nowyEmail });
}
