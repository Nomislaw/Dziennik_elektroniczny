namespace Dziennik_elektroniczny.DTOs.UzytkownikDto
{
    public class DodajUczenDto : UzytkownikBaseDto
    {
        public int KlasaId { get; set; }
        public List<int>? RodziceIds { get; set; }
    }
}
