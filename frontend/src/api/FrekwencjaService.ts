// src/api/FrekwencjaService.ts

// Zakładamy, że fetchAPI i getToken (lub logiczna obsługa tokena) są dostępne
import { fetchAPI } from "./api"; // <--- Musisz upewnić się, że to działa
import { FrekwencjaCreateDto, FrekwencjaUpdateDto, FrekwencjaDetailsDto } from '../types/Frekwencja';
import { UczenFrekwencja, ZajeciaDetails } from '../types/Zajecia'; // Importujemy nowe typy

const BASE_URL = "/Frekwencja"; // Endpoint z FrekwencjaController
const BASE_UZYTKOWNIK = "/uzytkownik"; 
const BASE_ZAJECIA = "/zajecia"; 

// --- Frekwencja API ---

// 1. Tworzenie nowego rekordu frekwencji (POST: api/Frekwencja)
export function createFrekwencja(dto: FrekwencjaCreateDto) {
    return fetchAPI(BASE_URL, {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

// 2. Aktualizacja istniejącego rekordu (PATCH: api/Frekwencja/{id})
export function updateFrekwencja(id: number, dto: FrekwencjaUpdateDto) {
    return fetchAPI(`${BASE_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
    });
}

// 3. Usuwanie rekordu (DELETE: api/Frekwencja/{id})
export function deleteFrekwencja(id: number) {
    return fetchAPI(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
}

// --- Funkcje filtrowania (Zakładamy, że istnieją endpointy na backendzie) ---

// UWAGA: Te endpointy muszą być zaimplementowane na backendzie (np. w FrekwencjaController)
// 4. Pobieranie aktualnej frekwencji dla listy uczniów i zajęć (GET api/Frekwencja/filtrowana)
export function getFrekwencjaByZajeciaAndDate(zajeciaId: number, data: string) {
    // Używamy query string dla filtrowania
    const url = `${BASE_URL}/filtrowana?zajeciaId=${zajeciaId}&data=${encodeURIComponent(data)}`;
    return fetchAPI(url, { method: "GET" });
}

// 5. Pobieranie uczniów dla danych zajęć/grupy (GET api/Zajecia/{id}/uczniowie)
export function getUczniowieDlaZajec(zajeciaId: number) {
    // Zakładamy, że masz endpoint na Zajeciach, który zwraca uczniów
    return fetchAPI(`${BASE_ZAJECIA}/${zajeciaId}/uczniowie`, { method: "GET" });
}

// 6. Pobieranie listy zajęć prowadzonych przez nauczyciela (GET api/Zajecia/nauczyciel/{id})
export function getZajeciaNauczyciela(nauczycielId: number) {
    // Zakładamy, że masz endpoint na Zajeciach, który filtruje po nauczycielu
    return fetchAPI(`${BASE_ZAJECIA}/nauczyciel/${nauczycielId}`, { method: "GET" });
}