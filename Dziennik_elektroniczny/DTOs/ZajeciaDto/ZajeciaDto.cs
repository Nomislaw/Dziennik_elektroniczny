namespace Dziennik_elektroniczny.DTOs.ZajeciaDto
{
    public class ZajeciaDto
    {
        public int Id { get; set; }

        public string GodzinaRozpoczecia { get; set; }
        public string GodzinaZakonczenia { get; set; }
        public DayOfWeek? DzienTygodnia { get; set; }

        public int PlanId { get; set; }
        public string PlanNazwa { get; set; }
        
        public int KlasaId { get; set; }

        public int PrzedmiotId { get; set; }
        public string PrzedmiotNazwa { get; set; }

        public int NauczycielId { get; set; }
        public string NauczycielImieNazwisko { get; set; }

        public int SalaId { get; set; }
        public string SalaNazwa { get; set; }
    }
}
