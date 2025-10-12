namespace Dziennik_elektroniczny.Models
{
    public abstract class Uzytkownik
    {
        public int Id { get; set; } // Klucz główny
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; } // W diagramie email jest w Nauczyciel i Rodzic, ale lepiej umieścić go w klasie bazowej
        public string Login { get; set; }
        public string HasloHash { get; set; } // Hasło powinno być hashowane, a nie przechowywane jako czysty tekst
        public string Stan { get; set; } // Np. "Aktywny", "Nieaktywny"
    }
}
