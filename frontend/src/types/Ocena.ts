import { TypOceny } from "./TypOceny";

export interface OcenaCreateDto {
  DataWystawienia: string;
  Opis: string;
  Wartosc: number;
  Typ: TypOceny;
  UczenId: number;
  NauczycielId: number;
  PrzedmiotId: number;
}

export interface OcenaDto extends OcenaCreateDto {
  Id: number;
  UczenImieNazwisko: string;
  NauczycielImieNazwisko: string;
  PrzedmiotNazwa: string;
}
