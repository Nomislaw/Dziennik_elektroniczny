using Dziennik_elektroniczny.Models;

namespace Dziennik_elektroniczny.DTOs.FrekwencjaDto
{
    public class FrekwencjaDto
    {
        public int Id { get; set; }
        public DateTime Data { get; set; }
        public Status Status { get; set; }

        public int UczenId { get; set; }
        public string UczenImieNazwisko { get; set; }

        public int ZajeciaId { get; set; }
        public string PrzedmiotNazwa { get; set; }
        public string NauczycielImieNazwisko { get; set; }
        public string SalaNazwa { get; set; }
    }
}
