using System.Numerics;

namespace Dziennik_elektroniczny.Models
{
    public class Semestr
    {
        public int Id { get; set; } // Klucz główny
        public DateTime DataRozpoczecia { get; set; }
        public DateTime DataZakonczenia { get; set; }
        public int Numer { get; set; }

        // Relacja 1-do-wielu: W jednym semestrze jest wiele planów (dla każdej klasy)
        public virtual ICollection<Plan> Plany { get; set; } = new List<Plan>();
    }
}
