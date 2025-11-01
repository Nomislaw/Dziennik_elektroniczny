export interface Uzytkownik {
  id: number;
  email: string;
  imie: string;
  nazwisko: string;
  token: string;
}

type Rola = "Uczen" | "Nauczyciel" | "Rodzic" | "Administrator";