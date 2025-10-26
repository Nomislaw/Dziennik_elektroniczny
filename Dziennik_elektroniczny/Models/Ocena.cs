namespace Dziennik_elektroniczny.Models
{
    public class Ocena : BaseEntity
    {

        public DateTime DataWystawienia { get; set; }
        public string Opis { get; set; }
        public float Wartosc { get; set; }
        public TypOceny Typ { get; set; }

        // Relacja 1-do-wielu (odwrotność): Ocena należy do jednego ucznia (teraz Uzytkownik)
        public int UczenId { get; set; }
        public virtual Uzytkownik Uczen { get; set; }

        // Relacja 1-do-wielu (odwrotność): Ocena została wystawiona przez jednego nauczyciela (teraz Uzytkownik)
        public int NauczycielId { get; set; }
        public virtual Uzytkownik Nauczyciel { get; set; }

        // Relacja 1-do-wielu (odwrotność): Ocena jest z jednego przedmiotu
        public int PrzedmiotId { get; set; }
        public virtual Przedmiot Przedmiot { get; set; }
    }
}
