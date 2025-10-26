namespace Dziennik_elektroniczny.Models
{
    public class Sala : BaseEntity
    {
        public string Numer { get; set; }

        // Relacja 1-do-wielu: W sali odbywa się wiele zajęć
        public virtual ICollection<Zajecia> Zajecia { get; set; } = new List<Zajecia>();
    }
}
