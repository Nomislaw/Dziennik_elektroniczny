// src/types/Frekwencja.ts

// Typy muszą być zgodne z enum Status z C#
export type StatusFrekwencji = 
    "Obecny" | 
    "Nieobecny" | 
    "Spóźnienie" | 
    "Usprawiedliwiony" | 
    "Nieusprawiedliwiony";

// Odpowiednik FrekwencjaDto
export interface FrekwencjaDetailsDto {
    id: number;
    data: string; // ISO date string
    status: StatusFrekwencji;
    
    uczenId: number;
    uczenImieNazwisko: string;

    zajeciaId: number;
    przedmiotNazwa: string;
    nauczycielImieNazwisko: string;
    salaNazwa: string;
}

// Odpowiednik FrekwencjaCreateDto
export interface FrekwencjaCreateDto {
    data: string; // ISO date string
    status: StatusFrekwencji;
    uczenId: number;
    zajeciaId: number;
}

// Odpowiednik FrekwencjaUpdateDto
export interface FrekwencjaUpdateDto {
    data?: string;
    status?: StatusFrekwencji;
    uczenId?: number;
    zajeciaId?: number;
}