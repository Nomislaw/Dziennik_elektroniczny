namespace Dziennik_elektroniczny.Models
{
    public class Ocena
    {
        public int Id { get; set; } // Klucz główny
        public DateTime DataWystawienia { get; set; }
        public string Opis { get; set; }
        public float Wartosc { get; set; } // Np. 4.5, 3.0
        public TypOceny Typ { get; set; }

        // Relacja 1-do-wielu (odwrotność): Ocena należy do jednego ucznia
        public int UczenId { get; set; }
        public virtual Uczen Uczen { get; set; }

        // Relacja 1-do-wielu (odwrotność): Ocena została wystawiona przez jednego nauczyciela
        public int NauczycielId { get; set; }
        public virtual Nauczyciel Nauczyciel { get; set; }

        // Relacja 1-do-wielu (odwrotność): Ocena jest z jednego przedmiotu
        public int PrzedmiotId { get; set; }
        public virtual Przedmiot Przedmiot { get; set; }
    }
}
