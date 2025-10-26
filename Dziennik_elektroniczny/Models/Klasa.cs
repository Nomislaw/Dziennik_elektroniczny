using System.Numerics;

namespace Dziennik_elektroniczny.Models
{
    public class Klasa
    {
        public int Id { get; set; }
        public string Nazwa { get; set; }
        public int Rok { get; set; }

        // Relacja 1-do-wielu: Klasa ma wielu uczniów (teraz typu Uzytkownik)
        public virtual ICollection<Uzytkownik> Uczniowie { get; set; } = new List<Uzytkownik>();

        // Relacja 1-do-1: Klasa ma jednego wychowawcę (teraz typu Uzytkownik)
        public int? WychowawcaId { get; set; } // Klucz obcy, nullable
        public virtual Uzytkownik Wychowawca { get; set; }

        // Relacja 1-do-1: Klasa ma jeden plan zajęć
        public int? PlanId { get; set; }
        public virtual Plan Plan { get; set; }
    }
}
