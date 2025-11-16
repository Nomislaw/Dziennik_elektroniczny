namespace Dziennik_elektroniczny.DTOs
{
    public class UczenSimpleDto
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string KlasaNazwa { get; set; }
        public int? KlasaId { get; set; }
        public string? Email { get; set; }
    }
}