namespace Dziennik_elektroniczny.DTOs.UzytkownikDto
{
    public class RodzicSimpleDto
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; internal set; }
    }
}