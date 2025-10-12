using System.Numerics;

namespace Dziennik_elektroniczny.Models
{
    public class Klasa
    {
        public int Id { get; set; } // Klucz główny
        public string Nazwa { get; set; } // Np. "1A", "3C"
        public int Rok { get; set; } // Np. 2025

        // Relacja 1-do-wielu: Klasa ma wielu uczniów
        public virtual ICollection<Uczen> Uczniowie { get; set; } = new List<Uczen>();

        // Relacja 1-do-1: Klasa ma jednego wychowawcę
        public int WychowawcaId { get; set; } // Klucz obcy
        public virtual Nauczyciel Wychowawca { get; set; }

        // Relacja 1-do-1: Klasa ma jeden plan zajęć
        public int? PlanId { get; set; } // Klucz obcy, może być null
        public virtual Plan Plan { get; set; }
    }
}
