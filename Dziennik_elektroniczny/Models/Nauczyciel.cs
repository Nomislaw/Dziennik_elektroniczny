namespace Dziennik_elektroniczny.Models
{
    public class Nauczyciel : Uzytkownik
    {
        // Relacja 1-do-wielu: Nauczyciel prowadzi wiele zajęć
        public virtual ICollection<Zajecia> ProwadzoneZajecia { get; set; } = new List<Zajecia>();

        // Relacja 1-do-wielu: Nauczyciel wystawia wiele ocen
        public virtual ICollection<Ocena> WystawioneOceny { get; set; } = new List<Ocena>();

        // Relacja 1-do-wielu: Nauczyciel tworzy wiele zadań
        public virtual ICollection<Zadanie> UtworzoneZadania { get; set; } = new List<Zadanie>();

        // Relacja 1-do-1: Nauczyciel może być wychowawcą jednej klasy
        public virtual Klasa Wychowawstwo { get; set; }
    }
}
