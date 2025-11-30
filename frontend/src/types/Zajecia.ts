// src/types/Zajecia.ts

// Reprezentuje Ucznia w kontekście Zajęć/Frekwencji
export interface UczenFrekwencja {
    id: number; // UczenId
    imie: string;
    nazwisko: string;
}

// Reprezentuje pojedyncze zajęcia (np. lekcję)
export interface ZajeciaDetails {
    id: number;
    przedmiot: string;
    grupa: string; // Zakładamy, że Grupa/Klasa jest potrzebna do filtrowania uczniów
    sala: string;
    godzina: string;
    // ... inne szczegóły
}