namespace Dziennik_elektroniczny.DTOs
{
    public class UczenDto
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public int? KlasaId { get; set; }
        public string KlasaNazwa { get; set; }
        public bool CzyEmailPotwierdzony { get; set; }
        public List<RodzicSimpleDto> Rodzice { get; set; }
        public int LiczbaOcen { get; set; }
        public double SredniaOcen { get; set; }
    }
}
