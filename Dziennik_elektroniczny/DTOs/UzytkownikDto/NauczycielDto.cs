namespace Dziennik_elektroniczny.DTOs.UzytkownikDto
{
    public class NauczycielDto
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public string Rola { get; set; }
        public bool CzyEmailPotwierdzony { get; set; }
        public bool CzyWychowawca { get; set; }
        public string? WychowawstwoKlasaNazwa { get; set; }
        public List<string> ProwadzonePrzedmioty { get; set; } = new();
        public int LiczbaWystawionychOcen { get; set; }
        public object WychowawstwoKlasaId { get; internal set; }
    }
}
