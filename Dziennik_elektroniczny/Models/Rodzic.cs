namespace Dziennik_elektroniczny.Models
{
    public class Rodzic : Uzytkownik
    {
        // Relacja wiele-do-wielu: Rodzic ma jedno lub więcej dzieci (uczniów)
        public virtual ICollection<Uczen> Dzieci { get; set; } = new List<Uczen>();
    }
}
