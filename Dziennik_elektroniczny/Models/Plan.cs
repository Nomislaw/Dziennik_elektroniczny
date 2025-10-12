namespace Dziennik_elektroniczny.Models
{
    public class Plan
    {
        public int Id { get; set; } // Klucz główny

        // Relacja 1-do-1 (odwrotność): Plan jest przypisany do jednej klasy
        public int KlasaId { get; set; } // Klucz obcy
        public virtual Klasa Klasa { get; set; }

        // Relacja 1-do-wielu (odwrotność): Plan obowiązuje w jednym semestrze
        public int SemestrId { get; set; } // Klucz obcy
        public virtual Semestr Semestr { get; set; }

        // Relacja 1-do-wielu: Plan składa się z wielu zajęć
        public virtual ICollection<Zajecia> Zajecia { get; set; } = new List<Zajecia>();
    }
}
