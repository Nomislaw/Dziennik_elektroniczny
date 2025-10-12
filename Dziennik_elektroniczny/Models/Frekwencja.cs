namespace Dziennik_elektroniczny.Models
{
    public class Frekwencja
    {
        public int Id { get; set; } // Klucz główny
        public DateTime Data { get; set; }
        public Status Status { get; set; }

        // Relacja 1-do-wielu (odwrotność): Wpis frekwencji dotyczy jednego ucznia
        public int UczenId { get; set; }
        public virtual Uczen Uczen { get; set; }

        // Relacja 1-do-wielu (odwrotność): Wpis frekwencji dotyczy jednych zajęć
        public int ZajeciaId { get; set; }
        public virtual Zajecia Zajecia { get; set; }
    }
}
