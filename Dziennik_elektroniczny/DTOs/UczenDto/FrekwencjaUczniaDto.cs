namespace Dziennik_elektroniczny.DTOs.UczenDto
{
    public class FrekwencjaUczniaDto
    {
        public int Id { get; set; }
        public string PrzedmiotNazwa { get; set; }
        public DateTime Data { get; set; }
        public string Status { get; set; }
        public string GodzinaRozpoczecia { get; set; }
        public string GodzinaZakonczenia { get; set; }
    }
}
