namespace Dziennik_elektroniczny.DTOs.UczenDto
{
    public class ZajeciaUczniaDto
    {
        public int Id { get; set; }
        public string PrzedmiotNazwa { get; set; }
        public string GodzinaRozpoczecia { get; set; }
        public string GodzinaZakonczenia { get; set; }
        public DayOfWeek? DzienTygodnia { get; set; }
        public string NauczycielImieNazwisko { get; set; }
        public string SalaNumer { get; set; }
    }
}
