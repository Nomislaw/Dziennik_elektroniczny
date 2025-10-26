namespace Dziennik_elektroniczny.Models
{
    public class Uzytkownik : BaseEntity
    {
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public string HasloHash { get; set; }

        // --- NOWA WŁAŚCIWOŚĆ ---
        public Rola Rola { get; set; }

        // --- WŁAŚCIWOŚCI Z 'UCZEN' ---
        public int? KlasaId { get; set; } // Nullable, bo Nauczyciel nie ma klasy
        public virtual Klasa Klasa { get; set; }

        // Oceny, które otrzymał ten Użytkownik (jako Uczeń)
        public virtual ICollection<Ocena> Oceny { get; set; } = new List<Ocena>();

        // Frekwencja tego Użytkownika (jako Ucznia)
        public virtual ICollection<Frekwencja> Frekwencje { get; set; } = new List<Frekwencja>();

        // --- WŁAŚCIWOŚCI Z 'NAUCZYCIEL' ---

        // Klasa, której ten Użytkownik jest Wychowawcą
        public virtual Klasa Wychowawstwo { get; set; }

        // Oceny wystawione przez tego Użytkownika (jako Nauczyciela)
        public virtual ICollection<Ocena> WystawioneOceny { get; set; } = new List<Ocena>();

        // Zadania utworzone przez tego Użytkownika (jako Nauczyciela)
        public virtual ICollection<Zadanie> UtworzoneZadania { get; set; } = new List<Zadanie>();

        // Zajęcia prowadzone przez tego Użytkownika (jako Nauczyciela)
        public virtual ICollection<Zajecia> ProwadzoneZajecia { get; set; } = new List<Zajecia>();

        // --- RELACJA M-M 'RODZIC' <-> 'UCZEN' ---

        // Dzieci tego Użytkownika (jako Rodzica)
        public virtual ICollection<Uzytkownik> Dzieci { get; set; } = new List<Uzytkownik>();

        // Rodzice tego Użytkownika (jako Ucznia)
        public virtual ICollection<Uzytkownik> Rodzice { get; set; } = new List<Uzytkownik>();
    }
}
