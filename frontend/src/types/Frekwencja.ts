export enum StatusFrekwencji {
  NIEOBECNY = 0,
  OBECNY = 1,
  SPOZNIONY = 2,
  USPRAWIEDLIWIONY = 3
}

export interface FrekwencjaDetailsDto {
    id: number;
    data: string;
    status: StatusFrekwencji; // Liczba 0-3
    
    uczenId: number;
    uczenImieNazwisko: string;

    zajeciaId: number;
    przedmiotNazwa: string;
    nauczycielImieNazwisko: string;
    salaNazwa: string;
}

export interface FrekwencjaCreateDto {
    data: string;
    status: StatusFrekwencji; // Liczba 0-3
    uczenId: number;
    zajeciaId: number;
}

export interface FrekwencjaUpdateDto {
    data?: string;
    status?: StatusFrekwencji; // Liczba 0-3
    uczenId?: number;
    zajeciaId?: number;
}

// ✅ Funkcja pomocnicza - wyświetlanie po polsku
export const getPolishStatusName = (status: StatusFrekwencji): string => {
    switch (status) {
        case StatusFrekwencji.OBECNY: return "Obecny";
        case StatusFrekwencji.NIEOBECNY: return "Nieobecny";
        case StatusFrekwencji.SPOZNIONY: return "Spóźniony";
        case StatusFrekwencji.USPRAWIEDLIWIONY: return "Usprawiedliwiony";
        default: return "Nieznany";
    }
};

// ✅ Wszystkie statusy jako tablica
export const ALL_STATUSES: StatusFrekwencji[] = [
    StatusFrekwencji.OBECNY,
    StatusFrekwencji.NIEOBECNY,
    StatusFrekwencji.SPOZNIONY,
    StatusFrekwencji.USPRAWIEDLIWIONY
];
