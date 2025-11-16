namespace Dziennik_elektroniczny.DTOs
{
    public class DodajUczenDto : UzytkownikBaseDto
    {
        public int KlasaId { get; set; }
        public List<int>? RodziceIds { get; set; }
    }
}
