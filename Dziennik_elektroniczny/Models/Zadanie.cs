namespace Dziennik_elektroniczny.Models
{
    public class Zadanie
    {
        public int Id { get; set; } // Klucz główny
        public DateTime DataOddania { get; set; }
        public string Opis { get; set; }
        public string Tytul { get; set; }

        // Relacja 1-do-wielu (odwrotność): Zadanie jest utworzone przez jednego nauczyciela
        public int NauczycielId { get; set; }
        public virtual Nauczyciel Nauczyciel { get; set; }

        // Relacja 1-do-wielu (odwrotność): Zadanie jest z jednego przedmiotu
        public int PrzedmiotId { get; set; }
        public virtual Przedmiot Przedmiot { get; set; }
    }
}
