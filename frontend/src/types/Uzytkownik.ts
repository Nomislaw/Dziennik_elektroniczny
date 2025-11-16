export type Rola = "Uczen" | "Nauczyciel" | "Rodzic" | "Administrator";

export interface Uzytkownik {
  id: number;
  email: string;
  imie: string;
  nazwisko: string;
  token: string;
  rola: Rola;
}

