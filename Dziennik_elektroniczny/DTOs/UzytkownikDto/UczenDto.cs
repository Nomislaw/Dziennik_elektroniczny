using Dziennik_elektroniczny.Models;

namespace Dziennik_elektroniczny.DTOs.UzytkownikDto
{
    public class UczenDto
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public string Rola { get; set; }
        public int? KlasaId { get; set; }
        public string KlasaNazwa { get; set; }
        public bool CzyEmailPotwierdzony { get; set; }
        public List<RodzicSimpleDto> Rodzice { get; set; }
        public int LiczbaOcen { get; set; }
        public double SredniaOcen { get; set; }
    }
}
