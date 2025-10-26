export interface Uzytkownik {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

type Rola = "Uczen" | "Nauczyciel" | "Rodzic" | "Administrator";