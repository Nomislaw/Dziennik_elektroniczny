using Dziennik_elektroniczny.Models;

namespace Dziennik_elektroniczny.DTOs.OcenyDto
{
    public class OcenaDto
    {
        public int Id { get; set; }
        public DateTime DataWystawienia { get; set; }
        public string Opis { get; set; }
        public float Wartosc { get; set; }
        public TypOceny Typ { get; set; }

        public int UczenId { get; set; }
        public string UczenImieNazwisko { get; set; }

        public int NauczycielId { get; set; }
        public string NauczycielImieNazwisko { get; set; }

        public int PrzedmiotId { get; set; }
        public string PrzedmiotNazwa { get; set; }
    }
}
