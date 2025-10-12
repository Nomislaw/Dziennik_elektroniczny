namespace Dziennik_elektroniczny.Models
{
    public class Uczen : Uzytkownik
    {
        public DateTime DataUrodzenia { get; set; }

        // Relacja 1-do-wielu (odwrotność): Uczeń należy do jednej klasy
        public int KlasaId { get; set; } // Klucz obcy
        public virtual Klasa Klasa { get; set; }

        // Relacja 1-do-wielu: Uczeń ma wiele ocen
        public virtual ICollection<Ocena> Oceny { get; set; } = new List<Ocena>();

        // Relacja 1-do-wielu: Uczeń ma wiele wpisów frekwencji
        public virtual ICollection<Frekwencja> Frekwencje { get; set; } = new List<Frekwencja>();

        // Relacja wiele-do-wielu: Uczeń ma jednego lub więcej rodziców
        public virtual ICollection<Rodzic> Rodzice { get; set; } = new List<Rodzic>();
    }
}
