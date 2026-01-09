namespace Dziennik_elektroniczny.Models;

public class Wiadomosc : BaseEntity
{
    public int NadawcaId { get; set; }
    public int OdbiorcaId { get; set; }
    public string Tresc { get; set; }
    public DateTime DataWyslania { get; set; } = DateTime.Now;
    public bool Przeczytana { get; set; } = false;
}