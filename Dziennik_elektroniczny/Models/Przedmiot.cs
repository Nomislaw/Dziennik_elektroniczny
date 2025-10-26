namespace Dziennik_elektroniczny.Models
{
    public class Przedmiot : BaseEntity
    {
        public string Nazwa { get; set; }

        // Relacja 1-do-wielu: Z przedmiotu jest wiele zajęć w planie
        public virtual ICollection<Zajecia> Zajecia { get; set; } = new List<Zajecia>();

        // Relacja 1-do-wielu: Z przedmiotu wystawianych jest wiele ocen
        public virtual ICollection<Ocena> Oceny { get; set; } = new List<Ocena>();

        // Relacja 1-do-wielu: Do przedmiotu przypisanych jest wiele zadań
        public virtual ICollection<Zadanie> Zadania { get; set; } = new List<Zadanie>();
    }
}
