namespace Dziennik_elektroniczny.DTOs.ZajeciaDto
{
    public class ZajeciaCreateDto
    {
        public string GodzinaRozpoczecia { get; set; }
        public string GodzinaZakonczenia { get; set; }
        public DayOfWeek? DzienTygodnia { get; set; }

        public int PlanId { get; set; }
        public int PrzedmiotId { get; set; }
        public int NauczycielId { get; set; }
        public int SalaId { get; set; }
    }
}
