export type UserType = "Uczen" | "Rodzic" | "Nauczyciel";

export interface User {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  typ: UserType;
  stan: string; 

  dataUrodzenia?: string | null; 

}