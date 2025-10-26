namespace Dziennik_elektroniczny.Models
{
    public class Zadanie : BaseEntity
    {
        public DateTime DataOddania { get; set; }
        public string Opis { get; set; }
        public string Tytul { get; set; }

        // Relacja 1-do-wielu (odwrotność): Zadanie jest utworzone przez jednego nauczyciela (teraz Uzytkownik)
        public int NauczycielId { get; set; }
        public virtual Uzytkownik Nauczyciel { get; set; }

        // Relacja 1-do-wielu (odwrotność): Zadanie jest z jednego przedmiotu
        public int PrzedmiotId { get; set; }
        public virtual Przedmiot Przedmiot { get; set; }
    }
}
