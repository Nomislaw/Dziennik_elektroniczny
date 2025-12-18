namespace Dziennik_elektroniczny.DTOs.UzytkownikDto
{
    public class DodajNauczycielaDto : UzytkownikBaseDto
    {
        public int? WychowawstwoKlasaId { get; set; }
        
        public List<int> KlasyIds { get; set; } = new();
        public List<int> PrzedmiotyIds { get; set; } = new();
    }
}
