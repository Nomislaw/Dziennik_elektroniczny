namespace Dziennik_elektroniczny.DTOs
{
    public class EdytujUcznia
    {
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public int KlasaId { get; set; }
        public List<int>? RodziceIds { get; set; }
    }
}
