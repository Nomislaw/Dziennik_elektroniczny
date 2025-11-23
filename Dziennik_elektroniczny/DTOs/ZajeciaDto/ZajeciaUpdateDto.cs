namespace Dziennik_elektroniczny.DTOs.ZajeciaDto
{
    public class ZajeciaUpdateDto
    {
        public string? GodzinaRozpoczecia { get; set; }
        public string? GodzinaZakonczenia { get; set; }

        public int? PlanId { get; set; }
        public int? PrzedmiotId { get; set; }
        public int? NauczycielId { get; set; }
        public int? SalaId { get; set; }
    }
}
