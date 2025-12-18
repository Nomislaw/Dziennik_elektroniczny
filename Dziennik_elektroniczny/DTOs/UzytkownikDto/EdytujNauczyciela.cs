namespace Dziennik_elektroniczny.DTOs.UzytkownikDto
{
    public class EdytujNauczyciela
    {
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public int? WychowawstwoKlasaId { get; set; }
        public List<int> KlasyIds { get; set; } = new();
        public List<int> PrzedmiotyIds { get; set; } = new();
    }
}
