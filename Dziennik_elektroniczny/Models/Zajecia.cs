namespace Dziennik_elektroniczny.Models
{
    public class Zajecia : BaseEntity
    {
        public string GodzinaRozpoczecia { get; set; }
        public string GodzinaZakonczenia { get; set; }
        public DayOfWeek? DzienTygodnia { get; set; }

        // Relacja 1-do-wielu (odwrotność): Zajęcia należą do jednego planu
        public int PlanId { get; set; }
        public virtual Plan Plan { get; set; }

        // Relacja 1-do-wielu (odwrotność): Zajęcia są z jednego przedmiotu
        public int PrzedmiotId { get; set; }
        public virtual Przedmiot Przedmiot { get; set; }

        // Relacja 1-do-wielu (odwrotność): Zajęcia prowadzi jeden nauczyciel (teraz Uzytkownik)
        public int NauczycielId { get; set; }
        public virtual Uzytkownik Nauczyciel { get; set; }

        // Relacja 1-do-wielu (odwrotność): Zajęcia odbywają się w jednej sali
        public int SalaId { get; set; }
        public virtual Sala Sala { get; set; }

        // Relacja 1-do-wielu: Na jednych zajęciach jest wiele wpisów frekwencji
        public virtual ICollection<Frekwencja> Frekwencje { get; set; } = new List<Frekwencja>();
    }
}
